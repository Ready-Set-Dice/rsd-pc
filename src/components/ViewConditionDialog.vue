<template>
    <v-dialog
        v-model="shown"
        :fullscreen="XSorSMOnly"
        max-width="590"
        @keydown.esc="close"
    >
        <v-card>
            <v-card-title class="text-h5 pb-5">
                {{condition.name}}<span v-if="condition.reduceOnEndTurn" class="caption">&nbsp;[reduces on turn end]</span>
            </v-card-title>
            <v-card-subtitle v-if="description">
                <span v-html="$sanitize(description)"></span>
            </v-card-subtitle>
            <v-card-text>
                <v-form
                    ref="conditionEditForm"
                    v-model="valid"
                    lazy-validation
                >
                    <v-text-field
                        v-if="conditionHasRounds(condition.selectedCondition)"
                        v-model="condition.duration"
                        label="Rounds (0 is permanent)"
                        type="number"
                        min="0"
                        prepend-icon="mdi-timer-outline"
                        readonly
                    ></v-text-field>
                    <v-text-field
                        v-if="conditionHasValue(condition.selectedCondition)"
                        v-model="condition.value"
                        label="Value"
                        type="number"
                        min="1"
                        prepend-icon="mdi-flask-plus-outline"
                        readonly
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                >
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            valid: true,
            shown: false,
            condition: {},
            description: null
        }
    },
    computed: {
        conditions() {
            return this.$store.getters.conditions
        },
        XSorSMOnly () {
            return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm'
        },
    },
    props: {
    },
    methods: {
        show(condition, description) {
            this.condition = condition
            this.description = description
            this.shown = true
        },
        close() {
            this.shown = false
        },
        findConditionIndex(name) {
            return Object.values(this.conditions).findIndex(c => { return c.name == name })
        },
        conditionHasRounds(name) {
            if (name) {
                if (name == 'Custom' || name == 'Frightened' || name == 'Blinded' || name == 'Clumsy' ||
                    name == 'Concealed' || name == 'Confuesed' || name == 'Controlled' || name == 'Dazzled' ||
                    name == 'Deafened' || name == 'Drained' || name == 'Encumbered' || name == 'Enfeebled' ||
                    name == 'Fascinated' || name == 'Flat-Footed' || name == 'Fleeing' || name == 'Friendly' ||
                    name == 'Grabbed' || name == 'Helpful' || name == 'Hidden' || name == 'Immobilized' ||
                    name == 'Indifferent' || name == 'Invisible' || name == 'Paralyzed' || name == 'Persistent Damage' ||
                    name == 'Quickened' || name == 'Sickened' || name == 'Slowed' || name == 'Stunned' ||
                    name == 'Stupefied' || name == 'Unconscious' || name == 'Undetected' || name == 'Unfriendly' ||
                    name == 'Hostile' || name == 'Unnoticed') {
                    return true
                }
            }
            return false
        },
        conditionHasValue(name) {
            // console.log(i, this.conditions[i] != -1 && this.conditions[i] != null)
            if (name) {
                if (name == 'Custom') {
                    return true
                } else if (name == 'Stunned' && this.condition.duration && this.condition.duration > 0) {
                    return false
                } else {
                    const conditionIndex = this.findConditionIndex(name)
                    return this.conditions[conditionIndex] && this.conditions[conditionIndex].system && 
                            this.conditions[conditionIndex].system.value.isValued ? true : false
                }
            }
            return false
        },
    }
}
</script>