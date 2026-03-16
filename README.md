# 🕹️ Pixel Weather Forecast

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-orange?style=for-the-badge)

A minimalist and stylish weather forecasting application featuring a retro-pixel aesthetic and a modern Glassmorphism interface.

## ✨ Features

* **Automatic Detection:** Get weather data for your current location with a single click using Geolocation API.
* **Manual Search:** Extensive database of countries, states, and cities to check the weather anywhere in the world.
* **Dynamic Backgrounds:** Atmospheric pixel-art backgrounds that change based on weather conditions (Clear, Clouds, Rain, Snow, Mist).
* **Responsive Design:** Fully optimized for both desktop and mobile devices.
* **Retro Vibes:** Powered by the `Press Start 2P` pixel font and custom hand-drawn graphics.

## 🛠️ Tech Stack

* **Framework:** Vue 3 (Composition API)
* **Language:** TypeScript 🚀
* **State Management:** Pinia
* **Build Tool:** Vite
* **APIs:**
    * [OpenWeatherMap API](https://openweathermap.org/) — Real-time weather data and geocoding.
    * [CountriesNow API](https://countriesnow.space/) — Comprehensive global location database.
* **Deployment:** GitHub Actions & GitHub Pages

## 🏗️ Architecture & Type Safety

The project has been fully migrated to **TypeScript** to ensure a robust and error-free development experience:

* **Centralized State:** Managed via **Pinia** with strict typing for weather data, coordinates, and location history.
* **Dynamic Background Logic:** Implemented using TypeScript `Record` types to safely map API weather descriptions to specific pixel-art assets.
* **Component Communication:** All props and custom events are strictly typed using Vue 3 `<script setup lang="ts">` interfaces.
* **Global Components:** Custom TypeScript configuration (`tsconfig.json` & `env.d.ts`) for seamless integration with **Vue Router**.

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/perehristova/weather-project.git](https://github.com/perehristova/weather-project.git)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your OpenWeather API key:
    ```env
    VITE_WEATHER_API_KEY=your_api_key_here
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🎨 Design Note
The application icon (pixel monitor) and various UI elements were custom-drawn to ensure a unique "old-school" gaming experience.
