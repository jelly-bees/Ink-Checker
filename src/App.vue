<template>
    <allergy-utility/>
</template>

<script>
import AllergyUtility from './components/AllergyUtility.vue';

export default {
    name: 'App',
    components: {
        [AllergyUtility.name]: AllergyUtility
    }
};
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
