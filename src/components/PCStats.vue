<template>
    <v-row v-if="data">
        <v-col>
            <v-row>
                <v-col cols=12>
                    <v-expansion-panels>
                        <v-expansion-panel class="secondary accent--text">
                            <v-expansion-panel-header>
                                <h3>Selected character: {{data.name}}</h3>
                                <template v-slot:actions>
                                    <v-icon color="accent">
                                    $expand
                                    </v-icon>
                                </template>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                You can change the stats of the selected character here.<br />
                                In the future, most of these will automatically be calculated based on your class/level etc.
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols=6 sm=3>
                    <v-text-field
                        v-model="data.level"
                        type="number"
                        min="1"
                        max="20"
                        :rules="levelNumberRules"
                        label="Level"
                        prepend-icon="mdi-star"
                        dark
                        v-on:change="change"
                        @focus="$event.target.select()"
                    ></v-text-field>
                </v-col>
                <v-col cols=6 sm=3>
                    <v-text-field
                        v-model="data.initiative"
                        type="number"
                        min="0"
                        max="100"
                        :rules="smallNumberRules"
                        label="Initiative"
                        prepend-icon="mdi-format-list-numbered"
                        dark
                        v-on:change="change"
                        @focus="$event.target.select()"
                    ></v-text-field>
                </v-col>
                <v-col cols=6 sm=3>
                    <v-text-field
                        v-model="data.maxhp"
                        type="number"
                        min="0"
                        max="1000"
                        :rules="largeNumberRules"
                        label="Max HP"
                        prepend-icon="mdi-heart"
                        dark
                        v-on:change="change"
                        @focus="$event.target.select()"
                    ></v-text-field>
                </v-col>
                <v-col cols=6 sm=3>
                    <v-text-field
                        v-model="data.hp"
                        type="number"
                        min="0"
                        max="1000"
                        :rules="largeNumberRules"
                        label="Current HP"
                        prepend-icon="mdi-heart-pulse"
                        dark
                        v-on:change="change"
                        @focus="$event.target.select()"
                    ></v-text-field>
                </v-col>
                <v-col cols=6 sm=3>
                    <v-text-field
                        v-model="data.ac"
                        type="number"
                        min="0"
                        max="100"
                        :rules="smallNumberRules"
                        label="AC"
                        prepend-icon="mdi-shield"
                        dark
                        v-on:change="change"
                        @focus="$event.target.select()"
                    ></v-text-field>
                </v-col>
                <v-col cols=6 sm=3>
                    <v-text-field
                        v-model="data.perception"
                        type="number"
                        min="0"
                        max="50"
                        :rules="tinyNumberRules"
                        :label="XSOnly ? 'Percep. mod' : 'Perception modifier'"
                        prepend-icon="mdi-eye"
                        dark
                        v-on:change="change"
                        @focus="$event.target.select()"
                    ></v-text-field>
                </v-col>
                <v-col cols=6 sm=3>
                    <v-text-field
                        v-model="data.fortitude"
                        type="number"
                        min="0"
                        max="50"
                        :rules="tinyNumberRules"
                        :label="XSOnly ? 'Fort. mod' : 'Fortitude modifier'"
                        prepend-icon="mdi-food-apple"
                        dark
                        v-on:change="change"
                        @focus="$event.target.select()"
                    ></v-text-field>
                </v-col>
                <v-col cols=6 sm=3>
                    <v-text-field
                        v-model="data.reflex"
                        type="number"
                        min="0"
                        max="50"
                        :rules="tinyNumberRules"
                        :label="XSOnly ? 'Reflex mod' : 'Reflex modifier'"
                        prepend-icon="mdi-rollerblade"
                        dark
                        v-on:change="change"
                        @focus="$event.target.select()"
                    ></v-text-field>
                </v-col>
                <v-col cols=6 sm=3>
                    <v-text-field
                        v-model="data.will"
                        type="number"
                        min="0"
                        max="50"
                        :rules="tinyNumberRules"
                        :label="XSOnly ? 'Will mod' : 'Will modifier'"
                        prepend-icon="mdi-head-cog"
                        dark
                        v-on:change="change"
                        @focus="$event.target.select()"
                    ></v-text-field>
                </v-col>
                <v-col cols=6 sm=3>
                    <v-text-field
                        v-model="data.speed"
                        type="number"
                        min="0"
                        max="200"
                        :rules="mediumNumberRules"
                        label="Speed"
                        prepend-icon="mdi-shoe-print"
                        dark
                        v-on:change="change"
                        @focus="$event.target.select()"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            levelNumberRules: [
                v => (!!Number(v) || Number(v) == 0) || 'This should be a number!',
                v => v >= 1 && v <= 20 || 'Must be between 1 and 20'
            ],
            tinyNumberRules: [
                v => (!!Number(v) || Number(v) == 0) || 'This should be a number!',
                v => v >= 0 && v <= 50 || 'Must be between 0 and 50'
            ],
            smallNumberRules: [
                v => (!!Number(v) || Number(v) == 0) || 'This should be a number!',
                v => v >= 0 && v <= 100 || 'Must be between 0 and 100'
            ],
            mediumNumberRules: [
                v => (!!Number(v) || Number(v) == 0) || 'This should be a number!',
                v => v >= 0 && v <= 200 || 'Must be between 0 and 200'
            ],
            largeNumberRules: [
                v => (!!Number(v) || Number(v) == 0) || 'This should be a number!',
                v => v >= 0 && v <= 1000 || 'Must be between 0 and 1000'
            ],
        }
    },
    computed: {
        XSOnly () {
            return this.$vuetify.breakpoint.name === 'xs'
        },
    },
    props: {
        data: Object,
    },
    methods: {
        change() {
            this.$emit("Change")
        }
    }
}
</script>

<style>

</style>