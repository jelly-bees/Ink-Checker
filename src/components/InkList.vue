<template>
    <div class="ink-list-inner">
        <div class="ink-entry"
            v-for="color in list"
            :key="color" :value="color">
            <drop class="ink-icon"
                :class="{'drop-border': inks[color].hex === '#ffffff'}"
                :style="{'fill': inks[color].hex}" />
            {{color}}
        </div>
    </div>
</template>

<script>
import Drop from 'assets/drop';

const inks = require('assets/inks.json');

export default {
    name: 'ink-list',
    components: {
        [Drop.name]: Drop
    },
    data() {
        return {
            inks
        };
    },
    props: {
        list: Array
    }
}
</script>

<style lang="scss">
.drop-border {
    stroke: #000000;
    stroke-width: 1;
}

.ink-icon {
    height: 1rem;
    margin-top: -0.2rem;
    width: 1rem;
    vertical-align: middle;
}

.ink-list-inner {
    display: flex;
    flex-wrap: wrap;

    .ink-entry {
        font-size: 0.9rem;
        margin: 0.25rem 0 0.25rem 0.5rem;
        width: 13rem;
    }
}
</style>
