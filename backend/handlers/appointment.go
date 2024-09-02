package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"weather-app/db"
	"weather-app/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func BookAppointment(w http.ResponseWriter, r *http.Request) {
	var appt models.Appointment

	if err := json.NewDecoder(r.Body).Decode(&appt); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	appt.ID = primitive.NewObjectID()
	appt.CreatedAt = time.Now()
	appt.MarkAsDone = false

	_, err := db.AppointmentCollection.InsertOne(context.Background(), appt)
	if err != nil {
		http.Error(w, "Failed to book appointment", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(appt)
}
