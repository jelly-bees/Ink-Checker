<template>
    <div class="allergy-container">

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
                        :style="{'background-color': colors[item.value].hex}">
                    </div>
                    <div class="option-text">
                        {{item.value}}
                    </div>
                </div>
            </template>
        </el-select-v2>

        <div class="dropdown-tester"
            v-if="selectedColor">
            Selected color is: {{selectedColor}}<br/>
            Pigments: {{colors[selectedColor].pigments}}<br/>
            Hex: {{colors[selectedColor].hex}}<br/>
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

        <!-- Prints out pigment data we're working with, delete later -->
        <b v-if="selectedColor">Pigment Aliases</b>
        <div v-for="pigment in Object.keys(pigmentAliases)"
            :key="pigment">
            <div class="pigment-entry"
                v-if="selectedColor && colors[selectedColor].pigments.includes(pigment)">
                Pigment C.I. #{{pigment}}<br/>
                Alias(es): {{pigmentAliases[pigment]}}<br/>
            </div>
        </div>

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

.ink-dropdown-options {
    .option-entry {
        display: flex !important;
        flex-direction: row !important;

        .option-sample {
            border-radius: 0.25rem;
            height: 1rem;
            margin: 0.5rem;
            width: 1rem;
        }

        .option-text {
            font-size: 1rem;
            margin-left: 0.5rem;
        }
    }
}

.dropdown-tester {
    margin: 0 1rem 1rem 1rem;
}

.color-entry,
.pigment-entry {
    margin: 0.5rem 1rem;
}
</style>
