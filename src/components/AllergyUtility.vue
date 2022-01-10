<template>
    <div class="allergy-container">
        <br/>
        <b>Eternal Ink Allergy Checker</b>
        <br/>
        <br/>
        Select a Color:
        <br/>

        <!-- Fancy dropdown template -->
        <el-select-v2
            class="ink-dropdown"
            popper-class="ink-dropdown-options"
            v-model="selectedColor"
            filterable
            remote
            :remote-method="dropdownFilter"
            :options="filteredOptions"
            placeholder="Select an Ink Color"
            @click="resetFilteredOptions"
        >
            <!-- Normally we'd just pop some plain text in here -->
            <!-- But instead we can write normal html in this special template tag -->
            <template #default="{ item }">
                <div class="option-entry">
                    <div class="option-sample"
                        :class="{'option-border':colors[item.value].hex==='#ffffff'}"
                        :style="{'background-color': colors[item.value].hex}">
                    </div>
                    <div class="option-text">
                        {{item.value}}
                    </div>
                </div>
            </template>
        </el-select-v2>

        <br/>

        <div class="dropdown-result"
            v-if="selectedColor">
            <div class="name-container">
                <div class="option-sample"
                    :class="{'option-border':colors[selectedColor].hex==='#ffffff'}"
                    :style="{'background-color': colors[selectedColor].hex}">
                </div>
                <div class="name-container-2">
                    <b>{{selectedColor}}</b> contains the following pigments:<br/>
                </div>
            </div>
            <ul>
                <li v-for="pigment in colors[selectedColor].pigments"
                    :key="pigment" :value="pigment">
                    C.I. #{{pigment}} (
                    <span v-if="selectedColor && colors[selectedColor].pigments.includes(pigment)">
                        {{pigmentAliases[pigment].join(' / ')}})
                    </span>
                </li>
            </ul>
            <div class="definite-avoid">
                <b>Definitely Avoid</b> (Contains all the above pigments):
                <ul>
                    <div v-for="color in Object.keys(colors)"
                        :key="color" :value="color">
                        <li v-if="colors[color].pigments.join(' / ').includes(colors[selectedColor].pigments.join(' / ')) && color !== selectedColor">
                            {{color}}
                        </li>
                    </div>
                </ul>
            </div>
        </div>


        <!-- Old dropdown code for reference, can delete -->
        <!--select id="colors-dropdown" name="color">
            <option v-for="color in Object.keys(colors)"
                :key="color" :value="color">
                {{color}}
            </option>
        </select-->

        <!-- Prints out color data we're working with, delete later -->
        <!--b>Colors</b-->
        <!--div class="color-entry"
            v-for="color in Object.keys(colors)"
            :key="color">
            Color: {{color}}<br/>
            Pigments: {{colors[color].pigments}}<br/>
            Hex: {{colors[color].hex}}<br/>
        </div-->

    </div>
</template>

<script>
import {
    ElSelectV2
} from 'element-plus';

const colors = require('assets/colors.json');
const pigmentAliases = require('assets/pigment-aliases.json');

export default {
    name: 'allergy-utility',
    components: {
        [ElSelectV2.name]: ElSelectV2
    },
    data() {
        return {
            colors,
            pigmentAliases,
            colorOptions: [],
            filteredOptions: [],
            selectedColor: ''
        };
    },
    // This happens before stuff gets rendered on the page
    beforeMount() {
        // The fancy dropdown demands data in a very specific format
        // You can mostly ignore this
        Object.keys(colors).forEach((color) =>
            this.colorOptions.push({label: color, value: color}));

        this.resetFilteredOptions();
    },
    methods: {
        dropdownFilter(query) {
            const res = this.colorOptions.filter((item) =>
                item.value.toLowerCase().includes(query.toLowerCase()));

            this.filteredOptions = res;
        },
        resetFilteredOptions() {
            this.filteredOptions = [...this.colorOptions];
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.ink-dropdown {
    font-size: 1rem;
    font-weight: bold;
    margin: 1rem 1rem 0 1rem;
    width: 30rem;
}

.option-sample {
    border-radius: 0.25rem;
    height: 1.125rem;
    margin: 0.5rem;
    width: 1.125rem;

    &.option-border {
        border: 1px solid black;
        height: calc(1.125rem - 2px);
        width: calc(1.125rem - 2px);
    }
}

.ink-dropdown-options {
    .option-entry {
        display: flex !important;
        flex-direction: row !important;

        .option-text {
            font-family: arial;
            font-size: 1rem;
            margin-left: 0.5rem;
            margin-top: 1px;
        }
    }
}

.dropdown-result {
    margin: 0 1rem 1rem 1rem;
}

.name-container {
    display:flex;
    flex-direction:row;
    margin: 1rem;
}

.name-container-2 {
    margin: 0.5rem;
}

.color-entry,
.pigment-entry {
    margin: 0.5rem 1rem;
}
</style>
