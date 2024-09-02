import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    fetchDoneAppointments,
    fetchPendingAppointments,
    markAsDone,
    unmarkAsDone
} from '../utils/fetchAppointments';
import { Appointment } from '../types';

const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const AdminView: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [viewDone, setViewDone] = useState(false);

    // Fetch appointments based on the view
    const { data: appointments, error, refetch } = useQuery<Appointment[], Error>({
        queryKey: ['appointments', viewDone],
        queryFn: viewDone ? fetchDoneAppointments : fetchPendingAppointments,
    });

    // Mutations with proper typing
    const mutationMarkAsDone = useMutation<void, Error, string>({
        mutationFn: markAsDone,
        onSuccess: () => refetch(),
    });

    const mutationUnmarkAsDone = useMutation<void, Error, string>({
        mutationFn: unmarkAsDone,
        onSuccess: () => refetch(),
    });

    // Handlers for marking and unmarking appointments
    const handleMarkAsDone = (id: string) => {
        mutationMarkAsDone.mutate(id);
    };

    const handleUnmarkAsDone = (id: string) => {
        mutationUnmarkAsDone.mutate(id);
    };

    // Render UI with handling of possible errors
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <button
                onClick={() => setViewDone(!viewDone)}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
                {viewDone ? 'View Pending' : 'View Done'}
            </button>
            <button
                onClick={onLogout}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 mt-2"
            >
                Logout
            </button>
            <table className="w-full mt-4 border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Phone</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Appointment Time</th>
                        <th className="border border-gray-300 p-2">Created At</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments?.map((appointment) => (
                        <tr key={appointment.id}>
                            <td className="border border-gray-300 p-2">{appointment.name}</td>
                            <td className="border border-gray-300 p-2">{appointment.phone}</td>
                            <td className="border border-gray-300 p-2">{appointment.email}</td>
                            <td className="border border-gray-300 p-2">
                                {formatDateTime(appointment.appointmentTimestamp)}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {formatDateTime(appointment.timestamp)}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {viewDone ? (
                                    <button
                                        onClick={() => handleUnmarkAsDone(appointment.id)}
                                        className="py-1 px-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                                    >
                                        Unmark as Done
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleMarkAsDone(appointment.id)}
                                        className="py-1 px-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                                    >
                                        Mark as Done
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminView;
