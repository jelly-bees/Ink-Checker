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

html,
body,
#app {
    height:100%;
    margin: 0px;
}

// This has to be here for the dropdown text in firefox
// No, I don't know why mozilla is like this
.option-text {
    font-family: arial;
}
</style>
