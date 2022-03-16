<template>
    <div class="allergy-container">
        <el-backtop :style="{'color': hasBorder(inks[selectedColor]?.hex) ? '#000000' : inks[selectedColor]?.hex}" />
        <div class="pigment-and-ink">
            <div class="pigment-zone">
                <div class="title-bar"
                    :class="{'none-selected': !selectedColor}"
                    :style="{'background-color': inks[selectedColor]?.hex, 'color': selectColorForBg(inks[selectedColor]?.hex)}">
                    <span @click="selectedColor = ''">Eternal Ink Allergy Checker</span>
                </div>

                <div class="name-container">
                    <drop v-if="selectedColor"
                        class="selected-drop"
                        :class="{'drop-border': hasBorder(inks[selectedColor].hex)}"
                        :style="{'fill': inks[selectedColor].hex}"
                        @click="inkSelectorVisible = true" />
                    <div v-else class="selected-drop"></div>

                    <span class="selected-name"
                        :class="{'none-selected': !selectedColor}"
                        @click="inkSelectorVisible = true">
                        {{selectedColor || 'Click Here to Select an Ink'}}
                    </span>

                    <el-dialog v-model="inkSelectorVisible"
                        :before-close="() => { inkFilter = ''; inkSelectorVisible = false; dropdownFilter(inkFilter); }"
                        title="Select an Ink" width="80%" top="5vh">
                        <el-input class="ink-filter" v-model="inkFilter"
                            placeholder="Filter by name" clearable
                            @input="dropdownFilter(inkFilter)">
                        </el-input>
                        <div class="ink-dropdown-options">
                            <div class="option-entry"
                                v-for="item in filteredOptions"
                                :key="item.value"
                                @click="selectedColor = item.value; inkSelectorVisible = false;">
                                <drop class="list-drop"
                                    :class="{'drop-border': hasBorder(inks[item.value].hex)}"
                                    :style="{'fill': inks[item.value].hex}" />
                                <div class="option-text">
                                    {{item.value}}
                                </div>
                            </div>
                            <span class="no-data" v-if="filteredOptions.length === 0">Ink(s) not found</span>
                        </div>
                    </el-dialog>

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
            All information obtained January 2022 from Eternal Ink Europe: <a href="https://www.eternal-ink.eu/information-safety.php">https://www.eternal-ink.eu/information-safety.php</a>
        </div>
    </div>
</template>

<script>
import {
    ElBacktop,
    ElCollapse,
    ElCollapseItem,
    ElDialog,
    ElInput
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
        [ElDialog.name]: ElDialog,
        [ElInput.name]: ElInput,
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
            inkFilter: '',
            inkSelectorVisible: false,
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
            if (!hex) {
                return false;
            }

            return this.selectColorForBg(hex) === '#000';
        },
        resetFilteredOptions() {
            this.filteredOptions = [...this.colorOptions];
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
.allergy-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    .title-bar {
        padding: 1rem 0;
        text-align: center;

        span {
            cursor: pointer;
            font-weight: bold;
        }

        &.none-selected {
            font-size: 3rem;

            span {
                cursor: unset;
            }
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
            cursor: pointer;
            height: 2rem;
            margin: 0.1rem 0.5rem 0 0;
            width: 2rem;
        }

        .selected-name {
            cursor: pointer;
            font-size: 2rem;
            font-weight: bold;

            &.none-selected {
                color: gray;
                margin-top: -2rem;
                text-align: center;
                width: 100%;
            }
        }

        .selected-text {
            font-size: 1rem;
            margin: 1rem 0 0 0.5rem;
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
