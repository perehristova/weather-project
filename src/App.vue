<script setup>
    import {
        ref,
        onMounted,
        computed
    } from 'vue'

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    const lat = ref(0);
    const lon = ref(0);
    const city = ref('');
    const state = ref('');
    const country = ref('');
    const errorMessage = ref('');
    const countries = ref([]);
    const states = ref([]);
    const cities = ref([]);
    const displayCountry = ref('');
    const displayState = ref('');
    const displayCity = ref('');
    const selectionMode = ref('');
    const isAutoLoading = ref(false);
    const isManualLoading = ref(false);
    const isErrorVisible = ref(false);
    const temp = ref(0);
    const weatherDescription = ref('');
    const weatherIcon = ref('');
    const timezone = ref(0);
    const lastSearchedLocation = ref('');
    const weatherBackgrounds = {
    'clear sky': 'sunny-bg.png',
    'overcast clouds': 'cloudy-bg.png',
    'scattered clouds': 'cloudy-bg.png',
    'broken clouds': 'cloudy-bg.png',
    'few clouds': 'cloudy-bg.png',
    'light rain': 'rainy-bg.png',
    'light snow': 'snow-bg.png',
    'mist': 'mist-bg.png',    
    'default': 'main-picture.png'
    };

    const currentBackground = computed(() => {
        const description = weatherDescription.value.toLowerCase();
        const imageName = weatherBackgrounds[description] || weatherBackgrounds['default'];
        return `url(${new URL(`./assets/images/${imageName}`, import.meta.url).href})`;
    });

    const isFormValid = computed(() => {
        return country.value && state.value && city.value;
    });

    const hasLocation = computed(() => {
        return lat.value !== 0 && lon.value !== 0;
    });
    const isFormChanged = computed(() => {
        return lastSearchedLocation.value !== `${country.value}-${state.value}-${city.value}`;
    });
    const isLoading = computed(() => isAutoLoading.value || isManualLoading.value);


    function success(position) {
        lat.value = position.coords.latitude;
        lon.value = position.coords.longitude;
        isAutoLoading.value = false;
        getWeather();
        fetchWeatherByCoords();
    }

    function error(err) {
        isAutoLoading.value = false;
        isErrorVisible.value = true;
        errorMessage.value = "Geolocation is unavailable";
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    function closeError() {
        isErrorVisible.value = false;
    }

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    onMounted(() => {
        isAutoLoading.value = true;
        setTimeout(() => {
            navigator.geolocation.getCurrentPosition(success, error, options);
        }, 2000);
        getNames();
    });

    function getLocation() {
        errorMessage.value = '';
        country.value = '';
        state.value = '';
        city.value = '';

        isAutoLoading.value = true;
        isErrorVisible.value = false;

        setTimeout(() => {
            navigator.geolocation.getCurrentPosition(success, error, options);
        }, 2000);
    }

    async function getWeather() {
        const URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat.value}&lon=${lon.value}&limit=1&appid=${API_KEY}`;

        try {
            const response = await fetch(URL);
            if (!response.ok) throw new Error("Server error");
            const data = await response.json();

            if (data.length > 0) {
                displayCity.value = data[0].name;
                displayState.value = data[0].state;
                displayCountry.value = data[0].country;
            } else {
                displayCity.value = '—';
                displayState.value = '—';
                displayCountry.value = '—';
            }
        }
        
        catch (e){
            console.error("Reverse geocoding error:", e);
            displayCity.value = '—'; displayState.value = '—'; displayCountry.value = '—';
        }


    }

    async function handleManualSelection() {
        errorMessage.value = '';
        resetWeatherData();
        isManualLoading.value = true;

        const URL = `https://api.openweathermap.org/geo/1.0/direct?q=${city.value},${state.value},${country.value}&limit=1&appid=${API_KEY}`;

        try {
            const response = await fetch(URL);
            const data = await response.json();

            if (data.length > 0) {
                lat.value = data[0].lat;
                lon.value = data[0].lon;
                lastSearchedLocation.value = `${country.value}-${state.value}-${city.value}`;
                selectionMode.value = "manual";
                await fetchWeatherByCoords();
            }
            else {
                throw new Error("Location not found");
            }
        } catch (e) {
            errorMessage.value = "Can't find this location. Try again.";
            resetWeatherData();
        } finally {
            isManualLoading.value = false;
        }
    }

    function resetWeatherData() {
        temp.value = 0;
        weatherDescription.value = '';
        weatherIcon.value = '';
        timezone.value = 0;
    }

    async function fetchWeatherByCoords() {
        const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.value}&lon=${lon.value}&appid=${API_KEY}&units=metric`;
        resetWeatherData();
        errorMessage.value = '';

        try {
            const response = await fetch(URL);
            if (!response.ok) throw new Error("Weather data not found");
            const data = await response.json();

            if (data.main) {
                temp.value = Math.round(data.main.temp);
                weatherDescription.value = data.weather[0].description;
                weatherIcon.value = data.weather[0].icon;
                timezone.value = data.timezone;
            }
        }

        catch (e) {
            console.error("Weather fetch error:", e);
            errorMessage.value = "Failed to load weather. Check connection."; 
            temp.value = 0;
            resetWeatherData();
        }

    }

    async function getNames() {
        const URL = `https://countriesnow.space/api/v0.1/countries`;

        try {
            const response = await fetch(URL);
            if (!response.ok) throw new Error("Failed to load countries");
            const data = await response.json();

            if (data.data.length > 0) {
                countries.value = data.data;
            }
        }
        catch (e) {
            console.error("API Error (Countries):", e);
        }
    }

    async function getStates() {
        states.value = [];
        cities.value = [];
        state.value = '';
        city.value = '';

        const URL = `https://countriesnow.space/api/v0.1/countries/states`;

        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    country: country.value
                }),
            });
            const data = await response.json();

            if (data.data.states.length > 0) {
                states.value = data.data.states;
            } else {
                states.value = [];
            }
        }

        catch (e) {
                console.error("API Error (States):", e);
        }        
    }

    async function getCities() {

        const URL = `https://countriesnow.space/api/v0.1/countries/state/cities`;

        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    country: country.value,
                    state: state.value
                }),
            });
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                cities.value = data.data;
            } else {
                cities.value = '—';
            }
        }

        catch (e) {
            console.error("API Error (Cities):", e);
            cities.value = [];
        }
    }
</script>





<template>
    <div class="page" :style="{ backgroundImage:currentBackground}">
        <div class="header">
            <h1 class="header_title">Weather forecast</h1>
        </div>
        <div class="weather_container glass-container">
            <div class="location">
                <div class="data-group">
                    <p class="city-text">Country: {{ displayCountry || '—' }}</p>
                    <p class="city-text">State: {{ displayState || '—'}}</p>
                    <p class="city-text">County: {{ displayCity || '—'}}</p>
                </div>
                <div class="buttons">
                    <button @click="selectionMode = 'auto'; getLocation()">{{ isAutoLoading ? 'Detecting...' : 'Automatic' }}</button>
                </div>
            </div>
            <div class="location-options">
                <div class="data-group">
                    <div class="options">
                        <label for="country-select">Country</label>
                        <select name="country" id="country-select" v-model="country" class="select-options" @change="getStates">
                            <option value="">Select country...</option>
                            <option v-for="countr in countries" :key="countr.country" :value=countr.country>
                                {{ countr.country }}
                            </option>
                        </select>
                    </div>
                    <div class="options">
                        <label for="state-select">State</label>
                        <select name="state" id="state-select" v-model="state" @change="getCities" class="select-options" :disabled="!country">
                            <option value="">Select state...</option>
                            <option v-for="st in states" :key="st.name" :value="st.name">
                                {{ st.name }}
                            </option>
                        </select>
                    </div>
                    <div class="options">
                        <label for="county-select">County</label>
                        <select name="county" id="county-select" v-model="city" class="select-options" :disabled="!country || !state">
                            <option value="">Select county...</option>
                            <option v-for="cityItem in cities" :key="cityItem" :value="cityItem">
                                {{ cityItem}}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="buttons">
                    <button @click="handleManualSelection" :disabled="!isFormValid || (hasLocation && !isFormChanged)">{{ isManualLoading ? 'Searching...' : 'Manual' }}</button>
                </div>
            </div>
        </div>
        <div class="container-information glass-container ">
            <div v-if="!hasLocation || isLoading || errorMessage" class="empty-state">
                <div v-if="isLoading" class="loader"></div>
                <img v-if="errorMessage && !isLoading" src="./assets/images/sad-cloud.png" alt="Sad Cloud" class="big-sad-cloud" />
                <p class="status-text">
                    {{ isLoading ? 'Searching for light...' : (errorMessage || 'Searching for light...') }}
                </p>
            </div>
            <div v-else class="weather-info">
                <p v-if="temp" class="weather-temp">{{ temp }}°C</p>
                <p class="weather-desc">{{ weatherDescription }}</p>
                <p v-if="timezone" class="weather-timezone">Timezone: UTC {{ timezone > 0 ? '+' : '' }}{{ timezone / 3600 }}h / {{ timezone > 0 ? '+' : '' }}{{ timezone}}s</p>
            </div>
        </div>
        <div class="footer">
            <p>The site was created in order to be created</p>
        </div>
    </div>
</template>



 

<style scoped>
    .page {
        min-inline-size: 320px;
        min-block-size: 100dvb;
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        transition: background-image 0.8s ease-in-out;
    }


    .big-sad-cloud {
        width: 175px;
    }

    .header {
        text-align: center;
        margin-top: 15px;
    }

    .header_title {
        font-family: 'PressStart2P', sans-serif;
    }

    .weather_container {
        display: flex;
        max-inline-size: 900px;
        justify-content: center;
        align-self: center;
        padding: 15px;
    }

    .glass-container {
        background: rgba(255, 255, 255, 0.1); 
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }    

    .container-location {
        display: flex;
    }

    .location,
    .location-options {
        min-inline-size: 350px;
    }

    .data-group {
        display: flex;
        flex-direction: column;
        gap: 15px;
        justify-content: center;
    }

    .city-text,
    .options {
        min-height: 25px;
        display: flex;
        align-items: center;
    }

    .options {
        display: flex;
        justify-content: space-between;
    }

    option {
        color: black;
        background-color: white;
    }

    .buttons {
        display: flex;
        justify-content: center;
        padding-top: 20px;
    }

    .select-options {
        font-family: 'Montserrat', sans-serif;
        flex: 1;
        max-width: 250px;
        font-size: 16px;
        padding-left: 5px;
        border: none;
        background-color: transparent;
        color: #fff;
        box-shadow:
            -2px 0 0 0 #fff,
            2px 0 0 0 #fff,
            0 -2px 0 0 #fff,
            0 2px 0 0 #fff;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        min-inline-size: 140px;
        padding: 10px;
        appearance: none;
        -webkit-appearance: none;
        border: none;
        background-color: transparent;
        font-family: 'PressStart2P', sans-serif;
        font-size: 10px;
        text-transform: uppercase;
        color: #fff;
        box-shadow:
            -2px 0 0 0 #fff,
            2px 0 0 0 #fff,
            0 -2px 0 0 #fff,
            0 2px 0 0 #fff;
    }

    button:focus{
        outline: none;
    }

    .select-options:focus {
        outline: none;
    }

    button:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    button:disabled {
    opacity: 0.5;
    cursor: auto;
    background-color: rgba(255, 255, 255, 0.2);
    }

    .footer {
        text-align: center;
        font-family: 'PressStart2P', sans-serif;
        font-size: 7px;
        margin-bottom: 15px;
        margin-top: 15px;
    }   

    .weather-info, .empty-state {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        min-height: 300px;
        padding-top: 50px;
        padding-bottom: 50px;
    }

    .container-information {
        min-height: 300px;
        min-inline-size: 732px;
        max-inline-size: 900px;
        padding-left: 15px;
        padding-right: 15px;
    }

    .weather-temp {
        font-size: 90px;
        font-family: 'PressStart2P', sans-serif;
    }

    .weather-desc, .weather-timezone, .status-text {
        font-family: 'PressStart2P', sans-serif;
        font-size: 15px;
    }

    .empty-state {
        justify-content: center;
        text-align: center;
    }
    
    .status-text {
        display: flex;
        justify-content: center;
    }

@media (max-width: 768px) {
    .weather_container {
        flex-direction: column; 
        align-items: center;
        width: 90%;
        min-inline-size: 0;
        margin: 0 auto;
    }

    .location, .location-options {
        min-inline-size: 0;
        width: 100%;
    }
    
    .container-information {
        width: 90%;
        min-inline-size: 0;
        margin: 20px auto;
    }

    .header {
        margin-top: 15px;
        margin-bottom: 15px;
    }
    
    .header_title {
        font-size: 16px;
    }

    .options {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .select-options {
        max-width: 100%;
        width: 100%;
    }

    .weather-temp {
        font-size: 50px;
    }

    .weather-desc, .weather-timezone, .status-text {
        font-size: 11px;
    }


}
</style>

