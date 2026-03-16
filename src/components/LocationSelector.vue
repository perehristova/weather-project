<script setup lang="ts">
    import {
        ref,
        onMounted,
        computed
    } from 'vue'   
    
    import {
        fetchCountries,
        fetchStates,
        fetchCities
    } from '../services/api';

    import  BaseButton  from './BaseButton.vue';
    import type { LocationData } from '../services/types';

    const city = ref<string>('');
    const state = ref<string>('');
    const country = ref<string>('');
    const countries = ref<any[]>([]);
    const states = ref<any[]>([]);
    const cities = ref<any[]>([]);

    const isFormValid = computed(() => {
        return country.value && state.value && city.value;
    });    

    const emit = defineEmits<{
         (e: 'location-changed', data: { city: string, state: string, country: string }): void
    }>();
    const props = defineProps({
        isLoading: Boolean
    });

    async function getNames() {
        try {
            countries.value = await fetchCountries();
        } catch (e) {
            console.error("API Error (Countries):", e);
        }
    }

    async function getStates() {
        states.value = [];
        cities.value = [];
        state.value = '';
        city.value = '';

        if (!country.value) return;

        try {
            states.value = await fetchStates(country.value);
        } catch (e) {
            console.error("API Error (States):", e);
        }
    }

    async function getCities() {
        if (!country.value || !state.value) return;

        try {
            cities.value = await fetchCities(country.value, state.value);
        } catch (e) {
            console.error("API Error (Cities):", e);
            cities.value = [];
        }
    }

    onMounted(() => {
        getNames();
    });

    function submitLocation() {
        emit('location-changed', {
            city: city.value,
            state: state.value,
            country: country.value
        });
    }
</script>

<template>

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
            <BaseButton 
              :loading="isLoading"
              :disabled="!isFormValid"
              label="Manual" 
              @click="submitLocation" 
            />
        </div>  
    </div>

</template>

<style scoped>
    .location-options {
        min-inline-size: 350px;
    }

    .data-group {
        display: flex;
        flex-direction: column;
        gap: 15px;
        justify-content: center;
    }

    option {
        color: black;
        background-color: white;
    }

    .options {
        min-height: 25px;
        display: flex;
        align-items: center;
        justify-content: space-between;
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

    .select-options:focus {
        outline: none;
    }

    .buttons {
        display: flex;
        justify-content: center;
        padding-top: 20px;
    }    

    @media (max-width: 768px) {
        .location-options {
            min-inline-size: 0;
            width: 100%;
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
    }

</style>