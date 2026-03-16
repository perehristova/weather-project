import {
    API_KEY,
    BASE_URL,
    COUNTRIES_URL
} from './config'

import type {
    WeatherData,
    LocationData
} from './types';


export async function getLocationName(lat: number, lon: number): Promise < LocationData[] > {
    const URL = `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`Reverse geocoding failed: ${response.status}`);

    return await response.json();
}

export async function getWeatherStats(lat: number, lon: number): Promise < WeatherData > {
    const URL = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`Weather fetch failed: ${response.status}`);
    return await response.json();
}

export async function getNameOfLocation(city: string, state: string, country: string): Promise < LocationData[] > {
    const URL = `${BASE_URL}/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${API_KEY}`;
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);

    return await response.json();
}

export async function fetchCountries(): Promise < any[] > {
    const response = await fetch(COUNTRIES_URL);
    if (!response.ok) throw new Error("Failed to load countries list");
    const data = await response.json();

    return data.data;
}

export async function fetchStates(countryName: string): Promise < any[] > {
    const response = await fetch(`${COUNTRIES_URL}/states`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            country: countryName
        }),
    });
    if (!response.ok) throw new Error(`Failed to load states for ${countryName}`);
    const data = await response.json();

    return data.data?.states || [];
}

export async function fetchCities(countryName: string, stateName: string): Promise < any[] > {
    const response = await fetch(`${COUNTRIES_URL}/state/cities`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            country: countryName,
            state: stateName
        }),
    });
    if (!response.ok) throw new Error(`Failed to load cities for ${stateName}`);
    const data = await response.json();

    return data.data || [];
}