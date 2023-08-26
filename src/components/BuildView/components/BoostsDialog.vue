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
            boostTemplate: null,
            scoresTemplate: null,
            tmpl: {
                labels: {
                    edit: {
                        title: 'Edit stats'
                    }  
                },
                inputs: {
                    fb: {
                        type: 'boosts',
                        scores: null,
                        template: null,
                    }
                }
            }
        }
    },
    methods: {
        show(edit = false, options = null, extra = null) {
            if (!!extra && !!extra.scores) {

                this.scoresTemplate = extra.scores
                this.tmpl.inputs.fb.scores = this.scoresTemplate
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
    }
}
</script>