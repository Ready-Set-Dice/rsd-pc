<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
    />
</template>

<script>
import BaseDialog from '@root/.shared/components/base/BaseDialog/BaseDialog'

export default {
    components: {
        BaseDialog,
    },
    data() {
        return {
            boostTemplate: null,
            scoresTemplate: null,
            tmpl: {
                labels: {
                    edit: {
                        title: 'Edit stats'
                    }  
                },
                steps: {
                    enabled: true,
                    items: [
                        'Ancestry',
                        'Background',
                        'Class',
                        'Free',
                    ],
                },
                inputs: {
                    ab: {
                        type: 'text',
                        header: 'Ancestry boosts',
                        step: 0,
                    },
                    ab0: {
                        type: 'select',
                        items: null,
                        step: 0,
                        hidden: true,
                    },
                    ab1: {
                        type: 'select',
                        items: null,
                        step: 0,
                        hidden: true,
                    },
                    ab2: {
                        type: 'select',
                        items: null,
                        step: 0,
                        hidden: true,
                    },
                    ab3: {
                        type: 'select',
                        items: null,
                        step: 0,
                        hidden: true,
                    },
                    awarning: {
                        type: 'text',
                        warning: 'Illegal duplicate boost!',
                        step: 0,
                        hidden: true
                    },
                    bb: {
                        type: 'text',
                        header: 'Background boosts',
                        step: 1,
                    },
                    bb0: {
                        type: 'select',
                        items: null,
                        step: 1,
                        hidden: true,
                    },
                    bb1: {
                        type: 'select',
                        items: null,
                        step: 1,
                        hidden: true,
                    },
                    bwarning: {
                        type: 'text',
                        warning: 'Illegal duplicate boost!',
                        step: 1,
                        hidden: true
                    },
                    cb: {
                        type: 'text',
                        header: 'Class boost',
                        step: 2,
                    },
                    cb0: {
                        type: 'select',
                        items: null,
                        step: 2,
                        hidden: true,
                    },
                    fb: {
                        type: 'boosts',
                        scores: null,
                        template: null,
                        step: 3,
                    }
                }
            }
        }
    },
    methods: {
        show(edit = false, options = null, extra = null) {
            if (!!extra && !!extra.boostTemplate && !!extra.scores) {

                this.boostTemplate = extra.boostTemplate
                this.scoresTemplate = extra.scores
                this.tmpl.inputs.fb.scores = this.scoresTemplate
                this.tmpl.inputs.fb.template = this.boostTemplate

                this.tmpl.inputs.ab.header = 'Ancestry boosts' + (!!extra.aName ? ' - ' + extra.aName : '')
                this.tmpl.inputs.bb.header = 'Background boosts' + (!!extra.bName ? ' - ' + extra.bName : '')
                this.tmpl.inputs.cb.header = 'Class boost' + (!!extra.cName ? ' - ' + extra.cName : '')

                if (!!this.boostTemplate.a && this.boostTemplate.a.length > 0) {
                    for(let i = 0; i < 4; i++) {
                        if (!!this.boostTemplate.a[i]) {
                            this.tmpl.inputs['ab'+i].items = this.boostTemplate.a[i].items
                            this.tmpl.inputs['ab'+i].locked = !this.boostTemplate.a[i].choice
                            this.tmpl.inputs['ab'+i].hidden = false
                            this.tmpl.inputs['ab'+i].icon = !!this.boostTemplate.a[i].flaw ? 'mdi-minus' : 'mdi-plus'
                            options['ab'+i] = !!options['ab'+i] && !!this.boostTemplate.a[i].items.includes(options['ab'+i]) ? options['ab'+i] : this.boostTemplate.a[i].items[0]
                        } else {
                            this.tmpl.inputs['ab'+i].hidden = true
                            this.tmpl.inputs['ab'+i].locked = true
                            this.tmpl.inputs['ab'+i].items = null
                            this.tmpl.inputs['ab'+i].icon = null
                        }
                    }
                }
                if (!!this.boostTemplate.b && this.boostTemplate.b.length > 0) {
                    for(let i = 0; i < 2; i++) {
                        if (!!this.boostTemplate.b[i]) {
                            this.tmpl.inputs['bb'+i].items = this.boostTemplate.b[i].items
                            this.tmpl.inputs['bb'+i].locked = !this.boostTemplate.b[i].choice
                            this.tmpl.inputs['bb'+i].hidden = false
                            this.tmpl.inputs['bb'+i].icon = !!this.boostTemplate.b[i].flaw ? 'mdi-minus' : 'mdi-plus'
                            options['bb'+i] = !!options['bb'+i] && !!this.boostTemplate.b[i].items.includes(options['bb'+i]) ? options['bb'+i] : this.boostTemplate.b[i].items[0]
                        } else {
                            this.tmpl.inputs['bb'+i].hidden = true
                            this.tmpl.inputs['bb'+i].locked = true
                            this.tmpl.inputs['bb'+i].items = null
                            this.tmpl.inputs['bb'+i].icon = null
                        }
                    }
                }
                if (!!this.boostTemplate.c && this.boostTemplate.c.length > 0) {
                    for(let i = 0; i < 1; i++) {
                        if (!!this.boostTemplate.c[i]) {
                            this.tmpl.inputs['cb'+i].items = this.boostTemplate.c[i].items
                            this.tmpl.inputs['cb'+i].locked = !this.boostTemplate.c[i].choice
                            this.tmpl.inputs['cb'+i].hidden = false
                            this.tmpl.inputs['cb'+i].icon = !!this.boostTemplate.c[i].flaw ? 'mdi-minus' : 'mdi-plus'
                            options['cb'+i] = !!options['cb'+i] && !!this.boostTemplate.c[i].items.includes(options['cb'+i]) ? options['cb'+i] : this.boostTemplate.c[i].items[0]
                        } else {
                            this.tmpl.inputs['cb'+i].hidden = true
                            this.tmpl.inputs['cb'+i].locked = true
                            this.tmpl.inputs['cb'+i].items = null
                            this.tmpl.inputs['cb'+i].icon = null
                        }
                    }
                }
            }

            if (!!options) {
                if (!options.fb) {
                    options.fb = []
                }
            }

            if (!!this.$refs && !!this.$refs.dialog) {
                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options)
            }
        },
        save(options) {
            if (!!options && !!options.level && (!!options.id || options.id == 0)) {
                let build = {...options}
                delete build.level
                delete build.id

                this.$rsd.playercharacters.updateBuild(options.id, options.level, build)
            }
        },
        onChange(options) {
            if (!!options) {
                const aDuplicates = options['ab0'] == options['ab1'] || options['ab0'] == options['ab2'] || options['ab0'] == options['ab3'] || options['ab1'] == options['ab2'] || options['ab1'] == options['ab3'] || options['ab2'] == options['ab3']
                const bDuplicates = options['bb0'] == options['bb1']

                let aWarning = false
                let bWarning = false

                if (!!aDuplicates) {
                    const col01 = options['ab0'] == options['ab1'] && !!options['ab0'] && !!options['ab1']
                    const col02 = options['ab0'] == options['ab2'] && !!options['ab0'] && !!options['ab2']
                    const col03 = options['ab0'] == options['ab3'] && !!options['ab0'] && !!options['ab3']
                    const col12 = options['ab1'] == options['ab2'] && !!options['ab1'] && !!options['ab2']
                    const col13 = options['ab1'] == options['ab3'] && !!options['ab1'] && !!options['ab3']
                    const col23 = options['ab2'] == options['ab3'] && !!options['ab2'] && !!options['ab3']
                    if (!!col01) { aWarning = aWarning || this.boostTemplate.a[0].flaw == this.boostTemplate.a[1].flaw }
                    if (!!col02) { aWarning = aWarning || this.boostTemplate.a[0].flaw == this.boostTemplate.a[2].flaw }
                    if (!!col03) { aWarning = aWarning || this.boostTemplate.a[0].flaw == this.boostTemplate.a[3].flaw }
                    if (!!col12) { aWarning = aWarning || this.boostTemplate.a[1].flaw == this.boostTemplate.a[2].flaw }
                    if (!!col13) { aWarning = aWarning || this.boostTemplate.a[1].flaw == this.boostTemplate.a[3].flaw }
                    if (!!col23) { aWarning = aWarning || this.boostTemplate.a[2].flaw == this.boostTemplate.a[3].flaw }
                }

                if (!!bDuplicates) {
                    const col01 = !!options['bb0'] && !!options['bb1']
                    if (!!col01) { bWarning = bWarning || this.boostTemplate.b[0].flaw == this.boostTemplate.b[1].flaw }
                }

                this.tmpl.inputs.awarning.hidden = !aWarning
                this.tmpl.inputs.bwarning.hidden = !bWarning
            }
        },
        // updateLabels(options) {
        //     // console.log('wisdom',options.wisdom)
        //     let saves = ['perception'].concat(this.DB.saves.get.names())
        //     saves.forEach(save => {
        //         if (!!options[save] || options[save] == 0) {
        //             let val = options[save]

        //             // console.log(`save ${save}, score_name ${score_name}, score ${score}, level ${level}, val ${val}, mod ${save_modifier}`)

        //             this.tmpl.inputs[save].label = `${this.Format.capitalize(save)} (${val > 0 ? '+' : ''}${val})`
        //         } else {
        //             this.tmpl.inputs[save].label = `${this.Format.capitalize(save)} (+0)`
        //         }
        //     })
        // },
    }
}
</script>