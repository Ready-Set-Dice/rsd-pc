<template>
    <GenericDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @Add="add"
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
                    new: {
                        title: 'Create character'
                    },
                    edit: {
                        title: 'Edit character'
                    }  
                },
                steps: {
                    enabled: true,
                    items: [
                        'Type',
                        'Info',
                    ],
                },
                inputs: {
                    text1: {
                        type: 'text',
                        html: "<b>Character type</b><br/><ul><li>Basic: Input stats and proficiency.</li><li>Advanced (currently N/A): Character builder</li></ul>",
                        step: 0
                    },
                    adv: {
                        label: "Character type",
                        type: "choice",
                        choices: ["Basic", "Advanced"],
                        step: 0
                    },
                    name: {
                        label: "Character name",
                        type: "string",
                        counter: 30,
                        required: true,
                        rule: 'name',
                        step: 1
                    },
                    level: {
                        label: "Level",
                        type: 'slider',
                        min: 1,
                        max: 20,
                        required: true,
                        rule: 'levelNumber',
                        step: 1
                    }
                }
            }
        }
    },
    methods: {
        show(edit = false, options = null) {
            if (!!this.$refs && !!this.$refs.dialog) {
                if (!!options) {
                    options.adv = !!options.adv ? 1 : 0
                    options.name = options.name || ''
                    options.level = options.level || 1
                }

                this.$refs.dialog.show(edit, options, true)
            }
        },
        add(options) {
            options.adv = !!options.adv
            this.$emit('Add', options)
        },
        save(options) {
            options.adv = !!options.adv
            this.$emit('Save', options)
        }
    }
}
</script>