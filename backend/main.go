package main

import (
	"log"
	"net/http"
	"os"
	"weather-app/handlers"
	"weather-app/db"
	"weather-app/middleware"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Connect to MongoDB
	db.ConnectDB()

	r := mux.NewRouter()

	// Public routes
	r.HandleFunc("/appointments", handlers.BookAppointment).Methods("POST")
	r.HandleFunc("/weather", handlers.GetWeather).Methods("GET")
    // Admin routes
    r.HandleFunc("/register", handlers.RegisterAdmin).Methods("POST")
    r.HandleFunc("/login", handlers.AdminLogin).Methods("POST")
	// Admin routes
	admin := r.PathPrefix("/admin").Subrouter()
	admin.HandleFunc("/appointments", handlers.GetAppointments).Methods("GET")
	admin.HandleFunc("/appointments/pending", handlers.GetPendingAppointments).Methods("GET")
	admin.HandleFunc("/appointments/done", handlers.GetDoneAppointments).Methods("GET")
	admin.HandleFunc("/appointments/toggle-done", handlers.ToggleMarkAsDone).Methods("POST")
	admin.Use(middleware.AdminOnly)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port
	}
	
	http.Handle("/", r)
	log.Println("Server started at :" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
