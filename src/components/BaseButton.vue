<script setup>
    defineProps({
      label: String,
      loading: Boolean,
      disabled: Boolean,
      type: {
        type: String,
        default: 'button'
      }
    });
</script>

<template>
    <button 
      :type="type" 
      :disabled="loading || disabled"
      class="pixel-button"
    >
      <slot>{{ loading ? 'Loading...' : label }}</slot>
    </button>
</template>


<style scoped>
    .pixel-button {
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

    .pixel-button:focus {
        outline: none;
    }

    .pixel-button:hover:not(:disabled) {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .pixel-button:disabled {
        opacity: 0.5;
        cursor: auto;
        background-color: rgba(255, 255, 255, 0.2);
    }

</style>