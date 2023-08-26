<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
    />
</template>

<script>
const hpLimits = {
    '1': {min: 5, max: 50},
    '2': {min: 10, max: 70},
    '3': {min: 15, max: 90},
    '4': {min: 20, max: 110},
    '5': {min: 25, max: 130},
    '6': {min: 30, max: 150},
    '7': {min: 35, max: 170},
    '8': {min: 40, max: 190},
    '9': {min: 45, max: 210},
    '10': {min: 50, max: 230},
    '11': {min: 55, max: 250},
    '12': {min: 60, max: 270},
    '13': {min: 65, max: 290},
    '14': {min: 70, max: 310},
    '15': {min: 75, max: 340},
    '16': {min: 80, max: 370},
    '17': {min: 85, max: 400},
    '18': {min: 90, max: 430},
    '19': {min: 95, max: 460},
    '20': {min: 100, max: 500},
}

import BaseDialog from '@root/.shared/components/base/BaseDialog/BaseDialog'

export default {
    components: {
        BaseDialog,
    },
    data() {
        return {
            tmpl: {
                labels: {
                    edit: {
                        title: 'Edit stats'
                    }  
                },
                steps: {
                    enabled: true,
                    items: [
                        'Health, AC & Speed',
                        'Base stats',
                        'Saving throws',
                    ],
                },
                inputs: {
                    maxhp: {
                        label: "Maximum health",
                        type: "number",
                        min: 1,
                        max: 1000,
                        required: true,
                        rule: 'largeNumber',
                        step: 0,
                        extra: {},
                    },
                    ac: {
                        label: "Armor class (AC)",
                        type: "number",
                        min: 8,
                        max: 50,
                        required: true,
                        rule: 'smallNumber',
                        step: 0,
                        extra: {},
                    },
                    speed: {
                        label: "Movement speed",
                        type: "number",
                        min: 5,
                        max: 100,
                        stepSize: 5,
                        required: true,
                        rule: 'mediumNumber',
                        step: 0,
                        extra: {},
                    },
                    strength: {
                        label: "Strength",
                        type: "number",
                        min: 5,
                        max: 30,
                        required: true,
                        rule: 'basicStatNumber',
                        step: 1,
                        extra: {},
                    },
                    dexterity: {
                        label: "Dexterity",
                        type: "number",
                        min: 5,
                        max: 30,
                        required: true,
                        rule: 'basicStatNumber',
                        step: 1,
                        extra: {},
                    },
                    constitution: {
                        label: "Constitution",
                        type: "number",
                        min: 5,
                        max: 30,
                        required: true,
                        rule: 'basicStatNumber',
                        step: 1,
                        extra: {},
                    },
                    intelligence: {
                        label: "Intelligence",
                        type: "number",
                        min: 5,
                        max: 30,
                        required: true,
                        rule: 'basicStatNumber',
                        step: 1,
                        extra: {},
                    },
                    wisdom: {
                        label: "Wisdom",
                        type: "number",
                        min: 5,
                        max: 30,
                        required: true,
                        rule: 'basicStatNumber',
                        step: 1,
                        extra: {},
                    },
                    charisma: {
                        label: "Charisma",
                        type: "number",
                        min: 5,
                        max: 30,
                        required: true,
                        rule: 'basicStatNumber',
                        step: 1,
                        extra: {},
                    },
                    perception: {
                        label: "Perception",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        step: 2,
                        extra: {},
                    },
                    fortitude: {
                        label: "Fortitude",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        step: 2,
                        extra: {},
                    },
                    reflex: {
                        label: "Reflex",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        step: 2,
                        extra: {},
                    },
                    will: {
                        label: "Will",
                        type: "number",
                        min: -2,
                        max: 50,
                        required: true,
                        rule: 'tinyNumberWithNegative',
                        step: 2,
                        extra: {},
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = null, extra = null) {
            if (!!extra && !!extra.level) {
                this.tmpl.inputs.maxhp.min = hpLimits[extra.level].min
                this.tmpl.inputs.maxhp.max = hpLimits[extra.level].max

                this.tmpl.inputs.ac.max = 50-(20-extra.level)
            }

            if (!!options) {
                options = this.DB.stats.toFlat(options)

                this.updateLabels(options)
            }

            if (!!this.$refs && !!this.$refs.dialog) {
                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options)
            }
        },
        save(options) {
            // console.log('options', options)

            options = this.DB.stats.toObject(options)

            if (!!options && !!options.saves && !!options.scores && !!options.maxhp && !!options.speed && !!options.ac 
            && (!!options.perception || options.perception == 0)  && (!!options.id || options.id == 0)) {
                this.$rsd.playercharacters.updateStats(options.id, {
                    saves: options.saves, 
                    scores: options.scores, 
                    maxhp: options.maxhp, 
                    perception: options.perception,
                    speed: options.speed,
                    ac: options.ac
                })
            }
        },
        onChange(options) {
            this.updateLabels(options)
        },
        updateLabels(options) {
            // console.log('wisdom',options.wisdom)
            let saves = ['perception'].concat(this.DB.saves.get.names())
            saves.forEach(save => {
                if (!!options[save] || options[save] == 0) {
                    let val = options[save]

                    // console.log(`save ${save}, score_name ${score_name}, score ${score}, level ${level}, val ${val}, mod ${save_modifier}`)

                    this.tmpl.inputs[save].label = `${this.Format.capitalize(save)} (${val > 0 ? '+' : ''}${val})`
                } else {
                    this.tmpl.inputs[save].label = `${this.Format.capitalize(save)} (+0)`
                }
            })
        },
    }
}
</script>