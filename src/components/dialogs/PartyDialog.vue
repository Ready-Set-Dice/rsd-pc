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
                        title: 'Join party',
                        button: 'Join'
                    },
                    edit: {
                        title: 'Join party',
                        button: 'Join'
                    }
                },
                inputs: {
                    choice: {
                        label: "Make a choice",
                        items: [],
                        type: "select",
                    },
                }
            },
        }
    },
    methods: {
        show(edit = false, options = null) {
            if (!!options) {
                if (!!options.localNamesObject) {
                    this.tmpl.inputs.choice.items = options.localNamesObject.names
                }
            }
            if (!!this.$refs && !!this.$refs.dialog) {
                this.$refs.dialog.show(edit, options)
            }
        },
        add(options) {
            this.$emit('Add', options)
        },
        save(options) {
            this.$emit('Save', options)
        }
    }
}
</script>