<script setup>
    import {
        ref,
        onMounted,
        computed
    } from 'vue';

    import { 
        getLocationName,
        getWeatherStats,
        getNameOfLocation
    } from '../services/api.js';

    import {
        API_KEY,
        weatherBackgrounds
    } from '../services/config.js';

    import
        LocationSelector 
    from '../components/LocationSelector.vue';

    import
        CurrentLocation 
    from '../components/CurrentLocation.vue';

    import
        WeatherDisplay 
    from '../components/WeatherDisplay.vue';    

    import { 
        useWeatherStore 
    } from '../stores/weatherStore';

    const weatherStore = useWeatherStore();    
    const errorMessage = ref('');
    const isAutoLoading = ref(false);
    const isManualLoading = ref(false);
    const isErrorVisible = ref(false);

    const isLoading = computed(() => isAutoLoading.value || isManualLoading.value);

    function success(position) {
        weatherStore.lat = position.coords.latitude;
        weatherStore.lon = position.coords.longitude;
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

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    onMounted(() => {
        isAutoLoading.value = true;
        navigator.geolocation.getCurrentPosition(success, error, options);
    });

    function getLocation() {
        errorMessage.value = '';
        isAutoLoading.value = true;
        isErrorVisible.value = false;
        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    async function getWeather() {
        try {
            const data = await getLocationName(weatherStore.lat, weatherStore.lon);

            if (data.length > 0) {
                weatherStore.displayCity = data[0].name;
                weatherStore.displayState = data[0].state;
                weatherStore.displayCountry = data[0].country;
            }
        } catch (e){
            console.error("Geocoding error:", e);
        }
    }

    async function handleManualSelection(locationData) {
        errorMessage.value = '';
        resetWeatherData();
        isManualLoading.value = true;

        try {
            const data = await getNameOfLocation(locationData.city, locationData.state, locationData.country);

            if (data.length > 0) {
                weatherStore.lat = data[0].lat;
                weatherStore.lon = data[0].lon;
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
        weatherStore.temp = 0;
        weatherStore.weatherDescription = '';
        weatherStore.timezone = 0;
    }

    async function fetchWeatherByCoords() {
        resetWeatherData();
        errorMessage.value = '';

        try {
            const data = await getWeatherStats(weatherStore.lat, weatherStore.lon);

            if (data.main) {
                weatherStore.temp = Math.round(data.main.temp);
                weatherStore.weatherDescription = data.weather[0].description;
                weatherStore.timezone = data.timezone;
            }
        }

        catch (e) {
            console.error("Weather fetch error:", e);
            errorMessage.value = "Failed to load weather. Check connection."; 
            weatherStore.temp = 0;
            resetWeatherData();
        }

    }
</script>

<template>
        <div class="weather_container glass-container">

            <CurrentLocation 
                :isLoading="isAutoLoading" 
                @request-location="getLocation" 
            />

            <LocationSelector 
                :isLoading="isManualLoading" 
                @location-changed="handleManualSelection" 
            />
        </div>

        <WeatherDisplay
        :isLoading="isLoading" 
        :errorMessage="errorMessage" 
        />
</template>

<style scoped>
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

    @media (max-width: 768px) {
        .weather_container {
            flex-direction: column;
            align-items: center;
            width: 90%;
            min-inline-size: 0;
            margin: 0 auto;
        }
    }
</style>