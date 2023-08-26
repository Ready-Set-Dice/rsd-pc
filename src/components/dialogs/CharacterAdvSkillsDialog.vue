<template>
    <GenericDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
    />
</template>

<script>

import GenericDialog from '@root/.shared/components/GenericDialog'

export default {
    components: {
        GenericDialog,
    },
    data() {
        return {
            tmpl: {
                labels: {
                    edit: {
                        title: 'Edit skills'
                    }  
                },
                inputs: {
                    acrobatics: {
                        label: "Acrobatics",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    arcana: {
                        label: "Arcana",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    athletics: {
                        label: "Athletics",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    crafting: {
                        label: "Crafting",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    deception: {
                        label: "Deception",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    diplomacy: {
                        label: "Diplomacy",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    intimidation: {
                        label: "Intimidation",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    lore: {
                        label: "Lore",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    medicine: {
                        label: "Medicine",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    nature: {
                        label: "Nature",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    occultism: {
                        label: "Occultism",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    performance: {
                        label: "Performance",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    religion: {
                        label: "Religion",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    society: {
                        label: "Society",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    stealth: {
                        label: "Stealth",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    survival: {
                        label: "Survival",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                    thievery: {
                        label: "Thievery",
                        type: "choice",
                        choices: ['U','T','E','M','L'],
                    },
                }
            }
        }
    },
    /*

    */
    methods: {
        show(edit = false, options = null, extra = null) {
            if (!!options) {
                options = this.DB.stats.toFlat(options)

                this.updateLabels(options)
            }

            if (!!this.$refs && !!this.$refs.dialog) {
                this.$refs.dialog.show(edit, options)
            }
        },
        save(options) {
            options = this.DB.stats.toObject(options)

            this.$emit('Save', options)
        },
        onChange(options) {
            this.updateLabels(options)
        },
        updateLabels(options) {
            // console.log(options)
            this.DB.skills.get.names().forEach(skill => {
                if (!!options[skill] || options[skill] == 0) {
                    let score_name = this.DB.skills.get.score(skill)
                    let score = this.AbilityScore.get.modifier(options[score_name])
                    let level = options.level
                    let val = options[skill]
                    let skill_modifier = this.Skills.get.modifier(score, level, val)

                    this.tmpl.inputs[skill].label = `${this.Format.capitalize(skill)} (${skill_modifier > 0 ? '+' : ''}${skill_modifier})`
                } else {
                    this.tmpl.inputs[skill].label = `${this.Format.capitalize(skill)} (+0)`
                }
            })
        },
    }
}
</script>