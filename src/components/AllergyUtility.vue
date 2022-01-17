<template>
    <div class="allergy-container">
        <div>
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
                @click="resetFilteredOptions">

                <!-- Normally we'd just pop some plain text in here -->
                <!-- But instead we can write normal html in this special template tag -->
                <template #default="{ item }">
                    <div class="option-entry">
                        <div class="option-sample"
                            :class="{'option-border': colors[item.value].hex==='#ffffff'}"
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
                        :class="{'option-border': colors[selectedColor].hex==='#ffffff'}"
                        :style="{'background-color': colors[selectedColor].hex}">
                    </div>
                    <div class="name-container-2">
                        <b>{{selectedColor}}</b> contains the following pigments:<br/>
                    </div>
                </div>
                <ul>
                    <li v-for="pigment in colors[selectedColor].pigments"
                        :key="pigment" :value="pigment">
                        C.I. #{{pigment}}
                        <span>
                            ({{pigmentAliases[pigment].join(' / ')}})
                        </span>
                    </li>
                </ul>
                <div class="definite-avoid"
                    v-if="getDefinitelyAvoid(selectedColor).length">
                    <b>Definitely Avoid</b> (Contains all the above pigments):
                    <ul>
                        <div v-for="color in getDefinitelyAvoid(selectedColor)"
                            :key="color" :value="color">
                            <li>
                                {{color}} {{colors[color].pigments}}
                            </li>
                        </div>
                    </ul>
                </div>
                <div class="definite-avoid" v-else>
                    No known inks share
                    <b>all {{colors[selectedColor].pigments.length}}</b>
                    of these pigments.
                </div>
            </div>
        </div>
        <div class="disclaimers">
            Not affiliated with Eternal Ink, Inc.
            <br/>
            Not medical advice. Always consult your doctor and your tattoo artist about possible allergic reactions.
            <br/>
            All information obtained from Eternal Ink Europe: <a href="https://www.eternal-ink.eu/information-safety.php">https://www.eternal-ink.eu/information-safety.php</a>
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
        getDefinitelyAvoid() {
            const mainPigments = this.colors[this.selectedColor].pigments;

            // Iterate over all color names and return a filtered list of all
            // that contain the above pigments.
            // "filter()" expects a boolean return.
            return Object.keys(this.colors).filter((c) => {

                // Make sure the color itself isn't included
                if (c === this.selectedColor) {
                    return false;
                }

                // Gather pigments to test for inclusion
                const subPigments = this.colors[c].pigments;

                // Assume a pigment set match until it isn't
                let isMatch = true;

                // Iterate over every pigment in the selected ("main") color
                // As soon as a "sub" color's pigment isn't found,
                // isMatch is false, and "every()" will stop
                mainPigments.every((mainPigment) => {
                    if (!subPigments.includes(mainPigment)) {
                        isMatch = false;
                    }

                    return isMatch;
                });

                // Tell the filtering function if this color's pigments
                // are a match or not
                return isMatch;
            });
        },
        resetFilteredOptions() {
            this.filteredOptions = [...this.colorOptions];
        }
    }
}
</script>

<style lang="scss">
.allergy-container {
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    height:100%;
    margin-left: 1rem;

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

    .disclaimers {
        text-align:center;
        color:#909399;
        padding-bottom: 1rem;
        padding-top: 1rem;
    }
}
</style>
