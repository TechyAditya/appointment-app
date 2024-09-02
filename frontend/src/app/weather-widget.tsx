import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

type WeatherData = {
    temperature: number;
    description: string;
    city: string;
};

const fetchWeather = async (city: string): Promise<WeatherData> => {
    const res = await fetch(`/api/weather?city=${city}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
};

const WeatherWidget = () => {
    const [city, setCity] = useState('Kolkata'); // Default city
    const [isEditing, setIsEditing] = useState(false);

    const { data: weather, isLoading, isError, refetch } = useQuery({
        queryKey: ['weather', city],
        queryFn: () => fetchWeather(city),
        enabled: !isEditing,
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsEditing(false);
        refetch();
    };

    return (
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Weather Widget</h2>

            {isEditing ? (
                <form onSubmit={handleFormSubmit} className="flex items-center">
                    <input
                        type="text"
                        value={city}
                        onChange={handleCityChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <button
                        type="submit"
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Submit
                    </button>
                </form>
            ) : (
                <div className="flex items-center justify-between">
                    <h3 className="text-lg">{city}</h3>
                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Edit
                    </button>
                </div>
            )}

            {isLoading ? (
                <p className="mt-4 text-gray-600">Loading...</p>
            ) : isError ? (
                <p className="mt-4 text-red-600">Error fetching weather data</p>
            ) : weather ? (
                <div className="mt-4">
                    <p className="text-2xl">{weather.temperature}°C</p>
                    <p className="text-gray-600">{weather.description}</p>
                </div>
            ) : (
                <p className="mt-4 text-gray-600">No weather data available</p>
            )}
        </div>
    );
};

export default WeatherWidget;
