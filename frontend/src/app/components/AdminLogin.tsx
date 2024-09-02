// ./components/AdminLogin.tsx
import React, { useState } from 'react';
import { LoginData, HandleLoginProps } from '../types';
import { loginAdmin } from '../utils/fetchAppointments';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

const handleLogin = async (data: LoginData, onLoginSuccess: () => void) => {
    try {
        // Call the loginAdmin function to authenticate
        await loginAdmin(data);

        // If login is successful, execute onLoginSuccess callback
        onLoginSuccess();
    } catch (error) {
        console.error('Login failed:', error);
        // Handle login error (e.g., show an error message to the user)
    }
};

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        try {
            // Call handleLogin with form data and success callback
            await handleLogin({ email, password }, onLoginSuccess);
        } catch (err) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                >
                    Login
                </button>
            </div>
        </form>
    );
};

export default AdminLogin;
