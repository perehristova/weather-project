<template>
    <div class="header">
        <h1 class="header_title">Weather forecast</h1>
        <nav class="nav-menu">
            <router-link to="/" class="nav-link">Weather</router-link>
            <router-link to="/about" class="nav-link">About</router-link>
        </nav>
    </div>
</template>

<style scoped>
    .header {
        text-align: center;
        margin-top: 15px;
    }

    .header_title {
        font-family: 'PressStart2P', sans-serif;
        margin-bottom: 20px;
    }
    .nav-menu {
        display: flex;
        justify-content: center;
        gap: 20px;
    }
    .nav-link {
        font-family: 'PressStart2P', sans-serif;
        font-size: 10px;
        color: white;
        text-decoration: none;
        opacity: 0.7;
        transition: opacity 0.3s;
    }

    .router-link-active {
        opacity: 1;
        text-decoration: underline;
    }
    
    .nav-link:hover {
        opacity: 1;
    }

    @media (max-width: 768px) {
        .header {
            margin-top: 15px;
            margin-bottom: 15px;
        }

        .header_title {
            font-size: 16px;
        }
    }
</style>