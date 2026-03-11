import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWeatherStore = defineStore('weather', () => {
    const lat = ref<number>(0);
    const lon = ref<number>(0);
    const temp = ref<number>(0);
    const weatherDescription = ref<string>('');
    const timezone = ref<number>(0);

    const displayCountry = ref<string>('');
    const displayState = ref<string>('');
    const displayCity = ref<string>('');


    function resetWeather() {
        temp.value = 0;
        weatherDescription.value = '';
        timezone.value = 0;
    };

    function resetLocation() {
        lat.value = 0;
        lon.value = 0;
        displayCountry.value = '';
        displayState.value = '';
        displayCity.value = '';
    }    

    return { 
        lat, lon, temp, timezone, weatherDescription, 
        displayCountry, displayState, displayCity,
        resetWeather, resetLocation
    };    
});


