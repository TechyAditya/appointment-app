'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '../utils/weather';

const WeatherWidget: React.FC = () => {
  const [city, setCity] = useState('Kolkata');
  const [isEditing, setIsEditing] = useState(false);

  const { data: weather, isLoading, isError, refetch } = useQuery({
    queryKey: ['weather', city],
    queryFn: () => fetchWeather(city),
    enabled: !isEditing,
  });

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    refetch();
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching weather data.</p>;

  return (
    <div>
      <h2>Weather in {city}</h2>
      <p>{weather?.temperature}°C</p>
      <p>{weather?.description}</p>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input type="text" value={city} onChange={handleCityChange} />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}
    </div>
  );
};

export default WeatherWidget;
