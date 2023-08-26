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
                    pcid: {
                        label: "Make a choice",
                        items: [],
                        type: "select",
                    },
                }
            },
        }
    },
    methods: {
        show(edit = false, options = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                if (!!options && !!options.pcnames) {
                    this.tmpl.inputs.pcid.items = options.pcnames

                    this.$refs.dialog.show(edit, options, true)
                }
            }
        },
        save(options) {
            if (!!options && !!options.gmid && !!options.partyid && !!options.pcid) {
                this.$rsd.playercharacters.joinParty({gmid: options.gmid, partyid: options.partyid, pcid: options.pcid})
            }
        }
    }
}
</script>