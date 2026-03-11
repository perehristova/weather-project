<script setup lang="ts">
    import {
        ref,
        onMounted,
        computed
    } from 'vue';

    import { 
        getLocationName,
        getWeatherStats,
        getNameOfLocation
    } from '../services/api';

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

    interface SelectedLocation {
        city: string;
        state: string;
        country: string;
    }

    const weatherStore = useWeatherStore();    
    const errorMessage = ref('');
    const isAutoLoading = ref(false);
    const isManualLoading = ref(false);

    const isLoading = computed(() => isAutoLoading.value || isManualLoading.value);

    async function success(position: GeolocationPosition) {
        weatherStore.lat = position.coords.latitude;
        weatherStore.lon = position.coords.longitude;
        
        // Запускаем оба запроса параллельно для скорости
        try {
            await Promise.all([
                getWeatherName(),
                fetchWeatherByCoords()
            ]);
        } finally {
            isAutoLoading.value = false;
        }
    }

    function error(err: GeolocationPositionError) {
        isAutoLoading.value = false;
        errorMessage.value = "Geolocation is unavailable";
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    onMounted(() => {
        getLocation();
    });

    function getLocation() {
        errorMessage.value = '';
        isAutoLoading.value = true;
        navigator.geolocation.getCurrentPosition(success, error, geoOptions);
    }

    async function getWeatherName() {
        try {
            const data = await getLocationName(weatherStore.lat, weatherStore.lon);

            if (data.length > 0) {
                weatherStore.displayCity = data[0].name;
                weatherStore.displayState = data[0].state || '';
                weatherStore.displayCountry = data[0].country;
            }
        } catch (e){
            console.error("Geocoding error:", e);
        }
    }

    async function handleManualSelection(locationData: SelectedLocation) {
        errorMessage.value = '';
        weatherStore.resetWeather();
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
            weatherStore.resetWeather();
        } finally {
            isManualLoading.value = false;
        }
    }

    async function fetchWeatherByCoords() {
        weatherStore.resetWeather();
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
            weatherStore.resetWeather();
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