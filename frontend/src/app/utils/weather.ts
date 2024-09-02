type WeatherData = {
    temperature: number;
    description: string;
    city: string;
};

export const fetchWeather = async (city: string): Promise<WeatherData> => {
    const res = await fetch(`/api/weather?city=${city}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
};
