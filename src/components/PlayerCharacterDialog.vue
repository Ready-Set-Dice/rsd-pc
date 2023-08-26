<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @Add="add"
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
            tmpl: {
                name: 'playercharacter-dialog',
                labels: {
                    new: {
                        title: 'Create character'
                    },
                    edit: {
                        title: 'Edit character'
                    }  
                },
                inputs: {
                    name: {
                        label: "Character name",
                        type: "string",
                        counter: 30,
                        required: true,
                        rule: 'name',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                this.$refs.dialog.show(edit, options, true)
            }
        },
        add(options) {

            if (!!options && !!options.name) {
                if (!options.color) {
                    // options.color = {r: 255, b: 255, g:255, a: 1}
                    options.color = this.Random.color()
                }
                if (!options.icon) {
                    options.icon = this.GameIcons.get.random()
                }
                if (!options.adv) {
                    options.adv = false
                }
                if (!options.level) {
                    options.level = 1
                }

                this.$rsd.playercharacters.addPC(options)
            }
            

            // console.log(options)

            // this.$emit('Add', options)
        },
        save(options) {
            // if (!!options.color && options.color.r == 255 && options.color.g == 255 && options.color.b == 255 && options.color.a == 1) {
            //     delete options.color
            // }

            if (!!options && !!options.name && (!!options._key || options._key == 0)) {
                this.$rsd.playercharacters.updateStats(options._key, {name: options.name})
            }

            // this.$emit('Save', options)
        }
    }
}
</script>