<template>
    <div class="header">
        <h1 class="header_title">Weather forecast</h1>
    </div>
</template>

<style scoped>
    .header {
        text-align: center;
        margin-top: 15px;
    }

    .header_title {
        font-family: 'PressStart2P', sans-serif;
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