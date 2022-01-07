<template>
    <div class="allergy-container">
        <b>Colors</b>
        <div class="color-entry" v-for="color in Object.keys(colors)" :key="color">
            Color: {{color}}<br/>
            Pigments: {{colors[color].pigments}}<br/>
            Hex: {{colors[color].hex}}<br/>
        </div>
        <b>Pigment Aliases</b>
        <div class="pigment-entry" v-for="pigment in Object.keys(pigmentAliases)" :key="pigment">
            Pigment C.I. #{{pigment}}<br/>
            Alias(es): {{pigmentAliases[pigment]}}<br/>
        </div>
    </div>
</template>

<script>
const colors = require('assets/colors.json');
const pigmentAliases = require('assets/pigment-aliases.json');

export default {
    name: 'allergy-utility',
    data() {
        return {
            colors,
            pigmentAliases
        };
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.color-entry,
.pigment-entry {
    margin: 0.5rem 1rem;
}
</style>
