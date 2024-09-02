// src/app/pages/index.tsx
import React from 'react';
import WeatherWidget from '../components/WeatherWidget';
import AppointmentForm from '../components/AppointmentForm';

const IndexPage: React.FC = () => {
    return (
        <div className="homepage">
            <WeatherWidget />
            <AppointmentForm />
        </div>
    );
};

export default IndexPage;
