<template>
    <div class="allergy-container">
        <el-backtop :style="{'color': hasBorder(inks[selectedColor]?.hex) ? '#000000' : inks[selectedColor]?.hex}" />
        <div class="pigment-and-ink">
            <div class="pigment-zone">
                <div class="title-bar" :style="{'background-color': inks[selectedColor]?.hex}">
                    <span>Eternal Ink Allergy Checker</span>
                </div>

                <div class="name-container">
                    <drop v-if="selectedColor"
                        class="selected-drop"
                        :class="{'drop-border': hasBorder(inks[selectedColor].hex)}"
                        :style="{'fill': inks[selectedColor].hex}" />
                    <div v-else class="selected-drop"></div>

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
                                    :class="{'drop-border': hasBorder(inks[item.value].hex)}"
                                    :style="{'fill': inks[item.value].hex}" />
                                <div class="option-text">
                                    {{item.value}}
                                </div>
                            </div>
                        </template>
                    </el-select-v2>

                    <span v-if="selectedColor" class="selected-text">
                        contains the following pigments:
                    </span>
                </div>

                <div class="dropdown-result" v-if="selectedColor">
                    <div class="pigment-list">
                        <div class="pigment-entry"
                            v-for="pigment in inks[selectedColor].pigments"
                            :key="pigment" :value="pigment">
                            <triangle class="pigment-icon"
                                :class="{'drop-border': hasBorder(pigments[pigment].hex)}"
                                :style="{'fill': pigments[pigment].hex}" />
                            C.I. #{{pigment}}
                            <span>
                                ({{pigments[pigment].aliases.join(' / ')}})
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ink-zone" v-if="selectedColor">
                <div class="dropdown-result">
                    <el-collapse class="ink-list">
                        <!-- Inks to DEFINITELY avoid -->
                        <el-collapse-item :disabled="getDefinitelyAvoid().length === 0" name="1">
                            <template #title>
                                <span class="collapse-title"
                                    v-if="getDefinitelyAvoid().length">
                                    <span class="collapse-primary">
                                        Definitely Avoid
                                    </span>
                                    <span class="collapse-secondary">
                                        Contains all of the above pigments
                                    </span>
                                </span>
                                <span class="collapse-title"
                                    v-else>
                                    <span class="collapse-secondary">No known inks share</span>
                                    <span class="collapse-primary">all {{inks[selectedColor].pigments.length}}</span>
                                    <span class="collapse-secondary">of these pigments.</span>
                                </span>
                            </template>
                            <ink-list :list="getDefinitelyAvoid()" />
                        </el-collapse-item>

                        <!-- Inks to MAYBE avoid -->
                        <el-collapse-item v-if="getAvoid().length" name="2">
                            <template #title>
                                <span class="collapse-title">
                                    <span class="collapse-primary">
                                        Use Caution
                                    </span>
                                    <span class="collapse-secondary">
                                        Contains some of the above pigments
                                    </span>
                                </span>
                            </template>
                            <ink-list :list="getAvoid()" />
                        </el-collapse-item>

                        <!-- Completely SAFE inks -->
                        <el-collapse-item :disabled="getSafe().length === 0" name="3">
                            <template #title>
                                <span class="collapse-title" v-if="getSafe().length">
                                    <span class="collapse-primary">
                                        Likely Safe
                                    </span>
                                    <span class="collapse-secondary">
                                        Contains none of the above pigments
                                    </span>
                                </span>
                                <span class="collapse-title"
                                    v-else>
                                    <span class="collapse-secondary">No known inks lack</span>
                                    <span class="collapse-primary">all {{inks[selectedColor].pigments.length}}</span>
                                    <span class="collapse-secondary">of these pigments.</span>
                                </span>
                            </template>
                            <ink-list :list="getSafe()" />
                        </el-collapse-item>
                    </el-collapse>

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
    ElBacktop,
    ElCollapse,
    ElCollapseItem,
    ElSelectV2
} from 'element-plus';

import InkList from 'components/InkList';

import Drop from 'assets/drop';
import Triangle from 'assets/triangle';

const inks = require('assets/inks.json');
const pigments = require('assets/pigments.json');

export default {
    name: 'allergy-utility',
    components: {
        [ElBacktop.name]: ElBacktop,
        [ElCollapse.name]: ElCollapse,
        [ElCollapseItem.name]: ElCollapseItem,
        [ElSelectV2.name]: ElSelectV2,
        [Drop.name]: Drop,
        [InkList.name]: InkList,
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

            // Iterate over all ink names and return a filtered list of all
            // that contain the above pigments.
            // "filter()" expects a boolean return.
            return Object.keys(this.inks).filter((i) => {

                // Make sure the ink itself isn't included
                if (i === this.selectedColor) {
                    return false;
                }

                // Gather pigments to test for inclusion
                const subPigments = this.inks[i].pigments;

                // Assume a pigment set match until it isn't
                let isMatch = true;

                // Iterate over every pigment in the selected ("main") ink
                // As soon as a "sub" ink's pigment isn't found,
                // isMatch is false, and "every()" will stop
                mainPigments.every((mainPigment) => {
                    if (!subPigments.includes(mainPigment)) {
                        isMatch = false;
                    }

                    return isMatch;
                });

                // Tell the filtering function if this ink's pigments
                // are a match or not
                return isMatch;
            });
        },
        getAvoid() {
            const everythingElse = [...this.getSafe(), ...this.getDefinitelyAvoid()];

            return Object.keys(this.inks).filter((i) => {
                // Make sure the ink itself isn't included
                if (i === this.selectedColor) {
                    return false;
                }

                return !everythingElse.includes(i);
            });
        },
        getSafe() {
            const mainPigments = this.inks[this.selectedColor].pigments;

            return Object.keys(this.inks).filter((i) => {
                const subPigments = this.inks[i].pigments;

                let isMatch = true;

                mainPigments.every((mainPigment) => {
                    if (subPigments.includes(mainPigment)) {
                        isMatch = false;
                    }

                    return isMatch;
                });

                return isMatch;
            });
        },
        hasBorder(hex) {
            return hex === '#ffffff';
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

    .title-bar {
        padding: 1rem 0;
        text-align: center;

        span {
            font-weight: bold;
        }
    }

    .drop-border {
        stroke: #000000;
        stroke-width: 1;
    }

    .name-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 1rem;

        .selected-drop {
            height: 2rem;
            margin: 0.5rem 0.5rem 0 0;
            width: 2rem;
        }

        .ink-dropdown {
            font-size: 1rem;
            font-weight: bold;
            margin-top: 0.5rem;
            width: 16rem;
        }

        .selected-text {
            font-size: 1rem;
            margin: 0.65rem 0 0 0.5rem;
            white-space: nowrap;
        }
    }

    .dropdown-result {
        .ink-list {
            margin: 0 1rem;
        }

        .pigment-list {
            margin-bottom: 1rem;

            .pigment-entry {
                font-size: 0.9rem;
                margin: 0.5rem 0 0.5rem 1.5rem;
            }
        }

        .pigment-icon {
            height: 1rem;
            margin-top: -0.2rem;
            vertical-align: middle;
            width: 1rem;
        }

        .collapse-title {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            font-size: 1.2rem;
            line-height: 1.1rem;

            .collapse-primary {
                font-weight: bold;
                margin: 0 0.5rem;
            }

            .collapse-secondary {
                font-size: 0.9rem;
                margin: 0 0.5rem;
                opacity: 0.7;
            }
        }
    }

    .disclaimers {
        // color: #909399;
        margin-top: 1rem;
        opacity: 0.5;
        padding: 1rem 0.5rem;
        text-align: center;
    }

}
</style>
