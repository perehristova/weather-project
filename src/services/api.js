import {
  API_KEY,
  BASE_URL,
  COUNTRIES_URL
} from './config.js' 


export async function getLocationName(lat, lon) {
  const URL = `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  const response = await fetch(URL);
  if (!response.ok) throw new Error("Server error");

  return await response.json();
}

export async function getWeatherStats(lat, lon) {
  const URL = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const response = await fetch(URL);
  if (!response.ok) throw new Error("Server error");

  return await response.json();
}

export async function getNameOfLocation(city, state, country) {
  const URL = `${BASE_URL}/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${API_KEY}`;
  const response = await fetch(URL);
  if (!response.ok) throw new Error("Server error");

  return await response.json();
}

export async function fetchCountries() {
  const response = await fetch(COUNTRIES_URL);
  if (!response.ok) throw new Error("Failed to load countries");
  const data = await response.json();

  return data.data;
}

export async function fetchStates(countryName) {
  const response = await fetch(`${COUNTRIES_URL}/states`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      country: countryName
    }),
  });
  const data = await response.json();
  
  return data.data?.states || [];
}

export async function fetchCities(countryName, stateName) {
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
  const data = await response.json();
  
  return data.data || [];
}