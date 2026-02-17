<script setup>
  // Тут живёт ЛОГИКА (JavaScript)
  import { ref, onMounted } from 'vue'

  const lat = ref(0);
  const lon = ref(0);
  const city = ref('');
  const state = ref('');
  const country = ref('');
  const errorMessage = ref('');
  const countrys = ref([]);
  const states = ref([]);
  const cities = ref([]);
  const displayCountry = ref('');  
  const displayState = ref('');  
  const displayCity = ref('');
  const selectionMode = ref('');
  const isLoading = ref(false);
  const isErrorVisible = ref(false);


  function success(position) {
    lat.value = position.coords.latitude;
    lon.value = position.coords.longitude;
    isLoading.value = false;
    getWeather();
  }

  function error(err) {
    isLoading.value = false;
    isErrorVisible.value = true;
    errorMessage.value = "Geolocation is unavailable. Please select manually or allow geolocation access";
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  function closeError() {
    isErrorVisible.value = false;
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  onMounted(() => {
    getNames();
  });

    function getLocation() {
    isLoading.value = true;
    isErrorVisible.value = false; // На всякий случай скрываем старые ошибки

    // Задержка в 2 секунды (2000 мс)
    setTimeout(() => {
        navigator.geolocation.getCurrentPosition(success, error, options);
    }, 2000); 
    }

  async function getWeather() {
    states.value = [];
    cities.value = [];
    country.value = '';
    const API_KEY = '684a2a306db928a090319025e7b1a1e0';
    const URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat.value}&lon=${lon.value}&limit=1&appid=${API_KEY}`;

    const response = await fetch (URL);
    const data = await response.json();

    if (data.length > 0) {
      displayCity.value = data[0].name;
      displayState.value = data[0].state;
      displayCountry.value = data[0].country;
    }
    else {
        displayCity.value = '—';
        displayState.value = '—';
        displayCountry.value = '—';
    }
        
  }

  async function getNames() {
    const URL = `https://countriesnow.space/api/v0.1/countries`;

    const response = await fetch (URL);
    const data = await response.json();

      if (data.data.length > 0) {
      countrys.value = data.data;
    }
  }

  async function getStates() {
    states.value = [];
    cities.value = [];
    state.value = '';
    city.value = '';

    const URL = `https://countriesnow.space/api/v0.1/countries/states`;


    const response = await fetch (URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({country: country.value}),
    });    
    const data = await response.json();

      if (data.data.states.length > 0) {
      states.value = data.data.states;
      }
      else { states.value = []; }
  }

  async function getCities() {

    const URL = `https://countriesnow.space/api/v0.1/countries/state/cities`;


    const response = await fetch (URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({country: country.value, state: state.value}),
    });    
    const data = await response.json();

      if (data.data && data.data.length > 0) {
        cities.value = data.data;
      }
      else {
        cities.value = '—';
      }
  }   

</script>





<template>
    <div class="page">
        <div class="header">
            <h1 class="header_title">Weather forecast</h1>
        </div>
        <div class="weather_container">

            <div class="weather_animation">
            </div>
            <div class="container-location">
                <div class="location">
                    <div class="data-group">
                        <p class="city-text">Country: {{ displayCountry || '—' }}</p>
                        <p class="city-text">State: {{ displayState || '—'}}</p>
                        <p class="city-text">County: {{ displayCity || '—'}}</p>
                    </div>
                    <div class="buttons">
                        <button @click="selectionMode = 'auto'; getLocation()">{{ isLoading ? 'Detecting...' : 'Automatic' }}</button>
                    </div>
                </div>
                <div class="location-options">
                    <div class="data-group">
                        <div class="options">
                            <label for="country-select">Country</label>
                            <select name="country" id="country-select" v-model="country" class="select-options" @change="getStates" :disabled="selectionMode !== 'manual'">
                                <option value="">Select country...</option>
                                <option v-for="countr in countrys" :value=countr.country>
                                    {{ countr.country }}
                                </option>
                            </select>
                        </div>
                        <div class="options">
                            <label for="state-select">State</label>
                            <select name="state" id="state-select" v-model="state" @change="getCities" class="select-options" :disabled="!country">
                                <option value="">Select state...</option>
                                <option v-for="st in states" :value="st.name">
                                    {{ st.name }}
                                </option>
                            </select>
                        </div>                      
                        <div class="options">
                            <label for="county-select">County</label>
                            <select name="county" id="county-select" v-model="city" class="select-options" :disabled="!country || !state">
                                <option value="">Select county...</option>
                                <option v-for="count in cities" :value="count">
                                    {{ count}}
                                </option>
                            </select>
                        </div>                      
                    </div>
                    <div class="buttons">
                        <button @click="selectionMode = 'manual'">Manual</button>
                    </div>                    
                </div>
            </div>
            <div class="timezone">
            </div>
        </div>
        <div class="footer">
          <p>The page will remain sad and gray if you don't choose your city</p>
        </div>
    </div>
    <div v-if="isErrorVisible">
        <div class="window-overlay" @click="closeError"></div>
        <div class="window-modal">
            {{ errorMessage }}
            <span @click="closeError" class="button-cross">&times;</span>
        </div>        
    </div>

</template>






<style scoped>

    .page {
        min-inline-size: 320px;
        min-block-size: 100dvb;
        background-image: url('./assets/images/main-picture.png');
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
        background-position: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 18px;
    }

    .header {
        text-align: center;
        margin-bottom: 15px;
        margin-top: 15px;
    }

    .header_title {
        font-family: 'PressStart2P', sans-serif;
    }

    .weather_container {
        max-inline-size: 900px;
        justify-content: center;
        align-self: center;
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

    .window-overlay {
        position: fixed;
        top: 0; right: 0; left: 0; bottom: 0;
        background-color: rgba(255, 255, 255, 0.5);
    }

    .window-modal {
        position: fixed;
        text-wrap: wrap;
        text-align: center;
        max-width: 450px;
        line-height: 14px;

        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        z-index: 101;
        color: rgb(240, 43, 43);
        background-color: white;
        font-family: 'PressStart2P', sans-serif;
        font-size: 9px;
        padding: 10px;
        box-shadow:
            -2px 0 0 0 rgba(255, 255, 255, 0.7),
            2px 0 0 0 rgba(255, 255, 255, 0.7),
            0 -2px 0 0 rgba(255, 255, 255, 0.7),
            0 2px 0 0 rgba(255, 255, 255, 0.7);        
    }

    .button-cross {
        cursor: pointer;
        position: absolute;
        top: 0; right: 0;
        color: grey;
        font-size: 13px;
    }

    .button-cross:hover {
        color: rgb(240, 43, 43);
        transform: scale(1.2);
    }    

</style>

