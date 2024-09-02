// src/types.ts
export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  timestamp: string;
  appointmentTimestamp: string;
  done: boolean;
}

export interface Admin {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface HandleLoginProps {
  onLoginSuccess: () => void;
}