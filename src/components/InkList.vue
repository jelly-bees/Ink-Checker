<template>
    <div class="ink-list-inner">
        <div class="ink-entry"
            v-for="color in list"
            :key="color" :value="color">
            <drop class="ink-icon"
                :class="{'drop-border': hasBorder(inks[color].hex)}"
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
    },
    methods: {
        hasBorder(hex) {
            if (!hex) {
                return false;
            }

            return this.selectColorForBg(hex) === '#000';
        },
        selectColorForBg(bgColor = '#ffffff') {
            const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
            const r = parseInt(color.substring(0, 2), 16); // hexToR
            const g = parseInt(color.substring(2, 4), 16); // hexToG
            const b = parseInt(color.substring(4, 6), 16); // hexToB

            return ((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186 ? '#000' : '#fff';
        }
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
