<script setup>
    import { useWeatherStore } from '../stores/weatherStore';
    import  BaseButton  from './BaseButton.vue';

    defineProps({
        isLoading: Boolean
    });
    const emit = defineEmits(['request-location']);
    const weatherStore = useWeatherStore();
</script>

<template>
    <div class="location">
        <div class="data-group">
            <p class="city-text">Country: {{ weatherStore.displayCountry || '—' }}</p>
            <p class="city-text">State: {{ weatherStore.displayState || '—'}}</p>
            <p class="city-text">County: {{ weatherStore.displayCity || '—'}}</p>
        </div>
        <div class="buttons">
            <BaseButton 
              :loading="isLoading" 
              label="Automatic" 
              @click="emit('request-location')" 
            />
        </div>
    </div>
</template>

<style scoped>
    .location {
        min-inline-size: 350px;
    }

    .data-group {
        display: flex;
        flex-direction: column;
        gap: 15px;
        justify-content: center;
    }

    .city-text {
        min-height: 25px;
        display: flex;
        align-items: center;
    }
    
    .buttons {
        display: flex;
        justify-content: center;
        padding-top: 20px;
    }


    @media (max-width: 768px) {
        .location {
            min-inline-size: 0;
            width: 100%;
        }
    }
</style>