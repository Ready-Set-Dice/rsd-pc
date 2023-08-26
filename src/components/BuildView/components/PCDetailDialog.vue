<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
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
                labels: {
                    edit: {
                        title: 'Edit details'
                    }  
                },
                inputs: {
                    detail: {
                        label: "Detail",
                        type: "string",
                        min: 0,
                        max: 30,
                        rule: 'uniqueid',
                    },
                }
            }
        }
    },
    /*

    */
    methods: {
        show(edit = false, options = null, extra = null) {
            if (!!options && !!options.detailType && !!this.$refs && !!this.$refs.dialog) {
                this.tmpl.inputs.detail.label = 'Set ' + this.$rsd.format.capitalize(options.detailType)

                this.$refs.dialog.show(edit, options)
            }
        },
        save(options) {
            if (!!options && !!options.detailType && !!options.detail) {
                console.log('detail', options)
                this.$rsd.playercharacters.updateDetails(options.id, {[options.detailType[0]]: options.detail})
            }
        },
    }
}
</script>