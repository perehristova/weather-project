export const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
export const BASE_URL = 'https://api.openweathermap.org';
export const COUNTRIES_URL = 'https://countriesnow.space/api/v0.1/countries';
export const weatherBackgrounds: Record<string, string> = {
    'clear sky': 'sunny-bg.png',
    'overcast clouds': 'cloudy-bg.png',
    'scattered clouds': 'cloudy-bg.png',
    'broken clouds': 'cloudy-bg.png',
    'few clouds': 'cloudy-bg.png',
    'light rain': 'rainy-bg.png',
    'light intensity shower rain': 'rainy-bg.png',
    'rain': 'rainy-bg.png',    
    'light snow': 'snow-bg.png',
    'snow': 'snow-bg.png',
    'mist': 'mist-bg.png',    
    'default': 'main-picture.png'
};