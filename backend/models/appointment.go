package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Appointment struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name            string             `bson:"name" json:"name"`
	Phone           string             `bson:"phone" json:"phone"`
	Email           string             `bson:"email" json:"email"`
	AppointmentTime time.Time          `bson:"appointmentTime" json:"appointmentTime"`
	CreatedAt       time.Time          `bson:"createdAt" json:"createdAt"`
	MarkAsDone      bool               `bson:"markAsDone" json:"markAsDone"`
}