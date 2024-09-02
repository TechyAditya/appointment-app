// ./pages/admin.tsx
import React, { useState } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminView from '../components/AdminView';

const AdminPage: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLoginSuccess = () => {
        setLoggedIn(true);
    };

    const handleLogout = () => {
        document.cookie = 'token=; Max-Age=0; path=/';
        setLoggedIn(false);
    };

    return (
        <div className="flex justify-center items-center h-screen">
            {loggedIn ? (
                <AdminView onLogout={handleLogout} />
            ) : (
                <AdminLogin onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default AdminPage;
