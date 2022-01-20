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
    height: 100%;
    margin: 0px;
}

// This has to be here for the dropdown text in firefox
// No, I don't know why mozilla is like this
.ink-dropdown-options {
    .option-entry {
        display: flex !important;
        flex-direction: row !important;

        .list-drop {
            height: 1rem;
            margin: 0.5rem 0;
            width: 1rem;

            &.drop-border {
                stroke: #000000;
                stroke-width: 1;
            }
        }

        .option-text {
            font-family: arial;
            font-size: 1rem;
            margin-left: 0.5rem;
            margin-top: 1px;
        }
    }
}

</style>
