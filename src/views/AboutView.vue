<template>
    <div class="about-page glass-container">
        <h2>About Project</h2>
        <p>This pixel-weather app was created to practice Vue 3, Pinia and Router.</p>
        <router-link to="/" class="back-link">← Back to Weather</router-link>
    </div>
</template>

<style scoped>
.about-page {
    padding: 40px;
    color: white;
    font-family: 'PressStart2P', sans-serif;
    text-align: center;
    margin: 50px auto;
    max-width: 600px;
}

h2 {
    margin-bottom: 20px;
}

p {
    line-height: 25px;
}

.back-link {
    display: block;
    margin-top: 20px;
    color: #42b983;
    text-decoration: none;
    font-size: 12px;
}
</style>