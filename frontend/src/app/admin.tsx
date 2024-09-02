// src/app/admin.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchAppointments, markAsDone, unmarkAsDone } from './utils/fetchAppointments';

const AdminView: React.FC = () => {
  const [viewDone, setViewDone] = useState(false);

  const { data: appointments, refetch } = useQuery(['appointments'], fetchAppointments);

  const mutationMarkAsDone = useMutation(markAsDone, {
    onSuccess: () => refetch(),
  });

  const mutationUnmarkAsDone = useMutation(unmarkAsDone, {
    onSuccess: () => refetch(),
  });

  const handleMarkAsDone = (id: string) => {
    mutationMarkAsDone.mutate(id);
  };

  const handleUnmarkAsDone = (id: string) => {
    mutationUnmarkAsDone.mutate(id);
  };

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    window.location.href = '/';
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => setViewDone(!viewDone)}>
        {viewDone ? 'View Active' : 'View Done'}
      </button>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {appointments?.map((appt) => (
          <li key={appt._id}>
            <p>{appt.name} - {appt.phone} - {appt.email} - {appt.appointmentTimestamp}</p>
            <button onClick={() => (appt.done ? handleUnmarkAsDone(appt._id) : handleMarkAsDone(appt._id))}>
              {appt.done ? 'Unmark as Done' : 'Mark as Done'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminView;
