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

.el-dialog__title {
    font-size: 1.25rem !important;
    font-weight: bold;
}

.el-dialog__body {
    height: 65vh;
    padding-top: 0 !important;
    padding-bottom: 0 !important;

    .el-input {
        font-size: 1rem;
    }
}

.el-dialog__footer {
    display: none;
}

.ink-dropdown-options {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-height: calc(100% - 2.5rem);
    overflow-y: scroll;
    padding-bottom: 0.5rem;

    .no-data {
        color: #aaa;
        font-size: 2rem;
        margin: 2rem 0;
        text-align: center;
        width: 100%;
    }

    .option-entry {
        cursor: pointer;
        display: flex !important;
        flex-direction: row !important;
        height: 2rem;
        width: 16rem;

        .list-drop {
            height: 1.5rem;
            margin: 0.5rem 0;
            width: 1.5rem;

            &.drop-border {
                stroke: #000000;
                stroke-width: 1;
            }
        }

        .option-text {
            font-family: arial;
            font-size: 1.15rem;
            margin-left: 0.5rem;
            margin-top: 0.6rem;
        }
    }
}

.el-select-v2__placeholder {
    color: #606060 !important;
}

</style>
