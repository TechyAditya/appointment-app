package handlers

import (
    "context"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "net/http"
    "time"
	"os"

    "github.com/golang-jwt/jwt/v5"
    "weather-app/db"
    "weather-app/models"
    "go.mongodb.org/mongo-driver/bson"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET"))

func AdminLogin(w http.ResponseWriter, r *http.Request) {
    var admin models.Admin
    var foundAdmin models.Admin

    if err := json.NewDecoder(r.Body).Decode(&admin); err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    hashedPassword := sha256.New()
    hashedPassword.Write([]byte(admin.Password))
    admin.Password = hex.EncodeToString(hashedPassword.Sum(nil))

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    err := db.AdminCollection.FindOne(ctx, bson.M{"email": admin.Email, "password": admin.Password}).Decode(&foundAdmin)
    if err != nil {
        http.Error(w, "Invalid email or password", http.StatusUnauthorized)
        return
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "email": admin.Email,
        "exp":   time.Now().Add(72 * time.Hour).Unix(),
    })

    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        http.Error(w, "Failed to generate token", http.StatusInternalServerError)
        return
    }

    // Set the token as a cookie
    http.SetCookie(w, &http.Cookie{
        Name:     "token",
        Value:    tokenString,
        Expires:  time.Now().Add(72 * time.Hour),
        HttpOnly: true,
        Secure:   false, // Set to true if using HTTPS
    })

    json.NewEncoder(w).Encode(map[string]string{"message": "Logged in successfully"})
}
