<script setup>
    import { useWeatherStore } from '../stores/weatherStore';
    import { computed } from 'vue';
    
    const props = defineProps({
        isLoading: Boolean,
        errorMessage: String
    });
    
    const weatherStore = useWeatherStore(); 
    const hasLocation = computed(() => {
        return weatherStore.lat !== 0 && weatherStore.lon !== 0;
    });
</script>

<template>
    <div class="container-information glass-container ">
        <div v-if="!hasLocation || isLoading || errorMessage" class="empty-state">
            <div v-if="isLoading"></div>
            <img v-if="errorMessage && !isLoading" src="../assets/images/sad-cloud.png" alt="Sad Cloud" class="big-sad-cloud" />
            <p class="status-text">
                {{ isLoading ? 'Searching for light...' : (errorMessage || 'Searching for light...') }}
            </p>
        </div>
        <div v-else class="weather-info">
            <p v-if="weatherStore.temp" class="weather-temp">{{ weatherStore.temp }}°C</p>
            <p class="weather-desc">{{ weatherStore.weatherDescription }}</p>
            <p v-if="weatherStore.timezone" class="weather-timezone">Timezone: UTC {{ weatherStore.timezone > 0 ? '+' : '' }}{{ weatherStore.timezone / 3600 }}h / {{ weatherStore.timezone > 0 ? '+' : '' }}{{ weatherStore.timezone}}s</p>
        </div>
    </div>
</template>

<style scoped>
    .container-information {
        min-height: 300px;
        min-inline-size: 732px;
        max-inline-size: 900px;
        padding-left: 15px;
        padding-right: 15px;
    }

    .glass-container {
        background: rgba(255, 255, 255, 0.1);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .weather-info,
    .empty-state {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        min-height: 300px;
        padding-top: 50px;
        padding-bottom: 50px;
    }

    .empty-state {
        justify-content: center;
        text-align: center;
    }

    .big-sad-cloud {
        width: 175px;
    }
    
    .weather-desc,
    .weather-timezone,
    .status-text {
        font-family: 'PressStart2P', sans-serif;
        font-size: 15px;
    }

    .status-text {
        display: flex;
        justify-content: center;
    }
    
    .weather-temp {
        font-size: 90px;
        font-family: 'PressStart2P', sans-serif;
    }    

    @media (max-width: 768px) {
        .container-information {
            width: 90%;
            min-inline-size: 0;
            margin: 20px auto;
        }

        .weather-desc,
        .weather-timezone,
        .status-text {
            font-size: 11px;
        }

        .weather-temp {
            font-size: 50px;
        }    
    }    

</style>