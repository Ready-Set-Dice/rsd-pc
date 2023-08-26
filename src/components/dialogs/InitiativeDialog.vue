<template>
    <GenericDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
    />
</template>

<script>
import GenericDialog from '@root/.shared/components/GenericDialog/index'

export default {
    components: {
        GenericDialog,
    },
    data() {
        return {
            perceptionBonus: 0,
            stealthBonus: 0,
            tmpl: {
                labels: {
                    new: {
                        title: 'Blank'
                    },
                    edit: {
                        title: 'Edit initiative'
                    }  
                },
                inputs: {
                    bonus: {
                        label: "Initative modifier",
                        type: "choice",
                        choices: ["Perception", "Stealth"],
                    },
                    initiative: {
                        label: "Initiative",
                        min: -1,
                        max: 100,
                        type: "number",
                        rule: 'initiativeNumber',
                        extra: {},
                    },
                    roll: {
                        label: "Roll for initiative",
                        type: "button",
                        bonus: 0,
                        click: () => {
                            if (!!this.$refs && !!this.$refs.dialog) {
                                let roll = Math.floor(Math.random() * 20 + 1 + this.tmpl.inputs.roll.bonus)
                                this.$refs.dialog.setOption("initiative",roll)
                            }
                        }
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = null, extra = null) {
            if (!!this.$refs && !!this.$refs.dialog) {
                if (!!options && !!options.name) {
                    this.tmpl.labels.edit.title = 'Edit initiative - ' + options.name
                }
                if (!!extra) {
                    if (!!extra.perception) {
                        this.updateLabels(extra.perception)

                        this.perceptionBonus = extra.perception
                    }
                    if (!!extra.stealth) {
                        this.stealthBonus = extra.stealth
                    }
                }
                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options)
            }
        },
        save(options) {
            this.$emit('Save', options)
        },
        onChange(options) {
            if (!!options && (!!options.bonus || options.bonus == 0)) {
                if (!!options.bonus) {
                    this.updateLabels(this.stealthBonus)
                } else {
                    this.updateLabels(this.perceptionBonus)
                }
            }
        },
        updateLabels(bonus) {
            this.tmpl.inputs.roll.bonus = bonus
            this.tmpl.inputs.initiative.label = `Initiative (${bonus>=0 ? '+' : ''}${bonus})`

            this.tmpl.inputs.initiative.min = 1 + bonus
            this.tmpl.inputs.initiative.max = 20 + bonus
        },
    }
}
</script>