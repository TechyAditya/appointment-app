package db

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	Client               *mongo.Client
	AppointmentCollection *mongo.Collection
	AdminCollection       *mongo.Collection
)

func ConnectDB() {
	// Get MongoDB URI from environment variables
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("MONGODB_URI is not set")
	}

	// Set up client options
	clientOptions := options.Client().ApplyURI(uri)

	// Create a new client and connect to the server
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Failed to create MongoDB client:", err)
	}

	// Ping the database to verify the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	log.Println("Connected to MongoDB!")

	// Set the global variables
	Client = client
	AppointmentCollection = client.Database("appointments_db").Collection("appointments")
	AdminCollection = client.Database("appointments_db").Collection("admins")
}
