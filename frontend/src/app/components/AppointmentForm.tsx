'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { bookAppointment } from '../utils/fetchAppointments';
import Checkmark from './Checkmark';
import AdminLogin from './AdminLogin';
import AdminView from './AdminView';

const AppointmentForm: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [appointmentTimestamp, setAppointmentTimestamp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const mutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error) => {
      console.error('Error booking appointment:', error);
    },
  });

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false); // Hide login form and show admin main page
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate({
      name,
      phone,
      email,
      appointmentTimestamp,
    });
  };

  if (submitted) {
    return <Checkmark />;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          required
        />
        <input
          type="datetime-local"
          value={appointmentTimestamp}
          onChange={(e) => setAppointmentTimestamp(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-400 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          required
        />
        <button
          type="submit"
          disabled={mutation.status === 'pending'} // Use 'pending' instead of 'loading'
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          {mutation.status === 'pending' ? 'Submitting...' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={toggleLogin}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Admin Login
        </button>
        {mutation.status === 'error' && <p>Error submitting appointment.</p>}
      </form>
      {showLogin && <AdminLogin onLoginSuccess={handleLoginSuccess} />}
      {isLoggedIn && <AdminView onLogout={handleLogout} />}
    </div>
  );
};

export default AppointmentForm;
