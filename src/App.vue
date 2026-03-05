<script setup>
import { computed } from 'vue';
import { useWeatherStore } from './stores/weatherStore';
import { weatherBackgrounds } from './services/config.js';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

const weatherStore = useWeatherStore();

const currentBackground = computed(() => {
    const description = (weatherStore.weatherDescription || 'default').toLowerCase();
    const imageName = weatherBackgrounds[description] || weatherBackgrounds['default'];
    return `url(${new URL(`./assets/images/${imageName}`, import.meta.url).href})`;
});
</script>

<template>
  <div class="page" :style="{ backgroundImage: currentBackground }">
    <AppHeader />
    <router-view /> 
    <AppFooter />
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