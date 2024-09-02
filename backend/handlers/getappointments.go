package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"weather-app/db"
	"weather-app/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetAppointments(w http.ResponseWriter, r *http.Request) {
	// Verify admin authentication here

	var appointments []models.Appointment

	cursor, err := db.AppointmentCollection.Find(context.Background(), bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch appointments", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	if err = cursor.All(context.Background(), &appointments); err != nil {
		http.Error(w, "Failed to decode appointments", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appointments)
}

func GetPendingAppointments(w http.ResponseWriter, r *http.Request) {
	// Verify admin authentication here

	var appointments []models.Appointment

	filter := bson.M{
		"$expr": bson.M{
			"$eq": []interface{}{"$markAsDone", false},
		},
	}

	cursor, err := db.AppointmentCollection.Find(context.Background(), filter)
	if err != nil {
		http.Error(w, "Failed to fetch appointments", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	if err = cursor.All(context.Background(), &appointments); err != nil {
		http.Error(w, "Failed to decode appointments", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appointments)
}

func GetDoneAppointments(w http.ResponseWriter, r *http.Request) {
	// Verify admin authentication here

	var appointments []models.Appointment

	filter := bson.M{
		"$expr": bson.M{
			"$eq": []interface{}{"$markAsDone", true},
		},
	}

	cursor, err := db.AppointmentCollection.Find(context.Background(), filter)
	if err != nil {
		http.Error(w, "Failed to fetch appointments", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	if err = cursor.All(context.Background(), &appointments); err != nil {
		http.Error(w, "Failed to decode appointments", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appointments)
}

func ToggleMarkAsDone(w http.ResponseWriter, r *http.Request) {
	// Verify admin authentication here
	var appointments []models.Appointment
	var appt models.Appointment
	if err := json.NewDecoder(r.Body).Decode(&appt); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	filter := bson.M{"_id": appt.ID}

	cursor, err := db.AppointmentCollection.Find(context.Background(), filter)
	if err != nil {
		http.Error(w, "Failed to fetch appointments", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	if err = cursor.All(context.Background(), &appointments); err != nil {
		http.Error(w, "Failed to decode appointments", http.StatusInternalServerError)
		return
	}
	update := bson.M{"$set": bson.M{"markAsDone": !appointments[0].MarkAsDone}}

	_, err = db.AppointmentCollection.UpdateOne(context.Background(), filter, update, options.Update().SetUpsert(true))
	if err != nil && err != mongo.ErrNoDocuments {
		http.Error(w, "Failed to toggle mark as done", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"message": "Appointment marked as done successfully"})
}
