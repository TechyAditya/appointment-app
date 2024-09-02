import { Appointment, LoginData, LoginResponse } from '../types';
export const fetchAppointments = async (): Promise<Appointment[]> => {
    const response = await fetch('/api/admin/appointments');
    if (!response.ok) {
        throw new Error('Failed to fetch appointments');
    }
    return response.json();
};
export const fetchDoneAppointments = async (): Promise<Appointment[]> => {
    const response = await fetch('/api/admin/appointments/done');
    if (!response.ok) {
        throw new Error('Failed to fetch appointments');
    }
    return response.json();
};
export const fetchPendingAppointments = async (): Promise<Appointment[]> => {
    const response = await fetch('/api/admin/appointments/pending');
    if (!response.ok) {
        throw new Error('Failed to fetch appointments');
    }
    return response.json();
};
export async function loginAdmin(data: LoginData): Promise<LoginResponse> {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to log in');
    }

    return response.json();
}


export const bookAppointment = async (appointment: {
    name: string;
    phone: string;
    email: string;
    appointmentTimestamp: string;
}) => {
    const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
    });

    if (!response.ok) {
        throw new Error('Failed to book appointment');
    }

    return response.json();
};
// Define the mutation functions
export const markAsDone = async (id: string): Promise<void> => {
    const response = await fetch(`/api/admin/appointments/toggle-done`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
    if (!response.ok) {
        throw new Error('Failed to mark appointment as done');
    }
};

export const unmarkAsDone = async (id: string): Promise<void> => {
    const response = await fetch(`/api/admin/appointments/toggle-done`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
    if (!response.ok) {
        throw new Error('Failed to unmark appointment as done');
    }
};