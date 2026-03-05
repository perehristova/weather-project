import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWeatherStore = defineStore('weather', () => {
    const lat = ref(0);
    const lon = ref(0);
    const temp = ref(0);
    const weatherDescription = ref('');
    const timezone = ref(0);

    const displayCountry = ref('');
    const displayState = ref('');
    const displayCity = ref('');


    function resetWeather() {
        temp.value = 0;
        weatherDescription.value = '';
    };

    return { 
        lat, lon, temp, weatherDescription, 
        displayCountry, displayState, displayCity,
        resetWeather 
    };    
});


