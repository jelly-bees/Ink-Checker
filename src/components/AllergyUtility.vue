<template>
    <div class="allergy-container">
        <div>
            <br/>
            <b>Eternal Ink Allergy Checker</b>
            <br/>
            <br/>
            <span>Select a Color:</span>
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
                        <drop class="list-drop"
                            :class="{'drop-border': inks[item.value].hex==='#ffffff'}"
                            :style="{'fill': inks[item.value].hex}" />
                        <div class="option-text">
                            {{item.value}}
                        </div>
                    </div>
                </template>
            </el-select-v2>

            <div class="dropdown-result" v-if="selectedColor">
                <div class="name-container">
                    <drop class="selected-drop"
                        :class="{'drop-border': inks[selectedColor].hex==='#ffffff'}"
                        :style="{'fill': inks[selectedColor].hex}" />
                    <div class="name-container-inner">
                        <b>{{selectedColor}}</b> contains the following pigments:<br/>
                    </div>
                </div>
                <div class="pigment-list">
                    <div class="pigment-entry"
                        v-for="pigment in inks[selectedColor].pigments"
                        :key="pigment" :value="pigment">
                        <triangle class="pigment-icon"
                            :class="{'drop-border': pigments[pigment].hex==='#ffffff'}"
                            :style="{'fill': pigments[pigment].hex}" />
                        C.I. #{{pigment}}
                        <span>
                            ({{pigments[pigment].aliases.join(' / ')}})
                        </span>
                    </div>
                </div>
                <div class="avoid-list"
                    v-if="getDefinitelyAvoid(selectedColor).length">
                    <b>Definitely Avoid</b> (Contains all the above pigments):
                    <div class="avoid-list-inner">
                        <div class="avoid-entry"
                            v-for="color in getDefinitelyAvoid(selectedColor)"
                            :key="color" :value="color">
                            <drop class="avoid-icon"
                                :class="{'drop-border': inks[color].hex==='#ffffff'}"
                                :style="{'fill': inks[color].hex}" />
                            {{color}}
                        </div>
                    </div>
                </div>
                <div class="avoid-list" v-else>
                    No known inks share
                    <b>all {{inks[selectedColor].pigments.length}}</b>
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

import Drop from 'assets/drop';
import Triangle from 'assets/triangle';

const inks = require('assets/inks.json');
const pigments = require('assets/pigments.json');

export default {
    name: 'allergy-utility',
    components: {
        [ElSelectV2.name]: ElSelectV2,
        [Drop.name]: Drop,
        [Triangle.name]: Triangle
    },
    data() {
        return {
            inks,
            pigments,
            colorOptions: [],
            filteredOptions: [],
            selectedColor: ''
        };
    },
    // This happens before stuff gets rendered on the page
    beforeMount() {
        // The fancy dropdown demands data in a very specific format
        // You can mostly ignore this
        Object.keys(this.inks).forEach((ink) =>
            this.colorOptions.push({label: ink, value: ink}));

        this.resetFilteredOptions();
    },
    methods: {
        dropdownFilter(query) {
            const res = this.colorOptions.filter((item) =>
                item.value.toLowerCase().includes(query.toLowerCase()));

            this.filteredOptions = res;
        },
        getDefinitelyAvoid() {
            const mainPigments = this.inks[this.selectedColor].pigments;

            // Iterate over all color names and return a filtered list of all
            // that contain the above pigments.
            // "filter()" expects a boolean return.
            return Object.keys(this.inks).filter((i) => {

                // Make sure the color itself isn't included
                if (i === this.selectedColor) {
                    return false;
                }

                // Gather pigments to test for inclusion
                const subPigments = this.inks[i].pigments;

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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin-left: 1rem;

    .ink-dropdown {
        font-size: 1rem;
        font-weight: bold;
        margin: 1rem 1rem 0 1rem;
        max-width: 30rem;
        width: calc(100% - 2rem);
        min-width: 10rem;
    }

    .drop-border {
        stroke: #000000;
        stroke-width: 1;
    }

    .dropdown-result {
        .name-container {
            display: flex;
            flex-direction: row;
            margin: 1rem;

            .selected-drop {
                height: 2rem;
                width: 2rem;
            }

            .name-container-inner {
                margin: 0.5rem;
            }
        }

        .avoid-list {
            margin: 2rem 0 0 2.5rem;

            @media (min-width: 601px) {
                width: 75%;
            }

            .avoid-list-inner {
                margin-top: 0.5rem;

                @media (min-width: 601px) {
                    display: flex;
                    flex-wrap: wrap;
                }

                .avoid-entry {
                    margin: 0.5rem 0 0.5rem 1rem;
                }
            }
        }

        .pigment-list {
            .pigment-entry {
                margin: 0.5rem 0 0.5rem 2.5rem;
            }
        }

        .avoid-icon,
        .pigment-icon {
            height: 1rem;
            vertical-align: middle;
            width: 1rem;
        }
    }

    .disclaimers {
        text-align: center;
        color: #909399;
        padding-bottom: 1rem;
        padding-top: 1rem;
    }

}
</style>
