package handlers

import (
    "context"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "net/http"
    "time"

    "weather-app/db"
    "weather-app/models"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
)

func RegisterAdmin(w http.ResponseWriter, r *http.Request) {
    var admin models.Admin

    if err := json.NewDecoder(r.Body).Decode(&admin); err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    // Hash the password using SHA-256 (or better use bcrypt for production)
    hashedPassword := sha256.New()
    hashedPassword.Write([]byte(admin.Password))
    admin.Password = hex.EncodeToString(hashedPassword.Sum(nil))

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    // Check if admin email already exists
    var existingAdmin models.Admin
    err := db.AdminCollection.FindOne(ctx, bson.M{"email": admin.Email}).Decode(&existingAdmin)
    if err != mongo.ErrNoDocuments {
        http.Error(w, "Admin with this email already exists", http.StatusConflict)
        return
    }

    // Insert the new admin into the database
    _, err = db.AdminCollection.InsertOne(ctx, admin)
    if err != nil {
        http.Error(w, "Failed to create admin", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"message": "Admin created successfully"})
}
