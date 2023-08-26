<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
    >
    </BaseDialog>
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
                name: 'playercharacter-level-dialog',
                labels: {
                    new: {
                        title: 'Edit level'
                    },
                    edit: {
                        title: 'Edit level'
                    }  
                },
                inputs: {
                    level: {
                        label: "Current Level",
                        type: "slider",
                        min: 1,
                        max: 20,
                        required: true,
                        rule: 'levelNumber',
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
        save(options) {
            if (!!options && !!options.level && (options.level >= 1 && options.level <= 20) && (!!options._key || options._key == 0)) {
                this.$rsd.playercharacters.updateStats(options._key, {level: options.level})
            }
        },
    }
}
</script>