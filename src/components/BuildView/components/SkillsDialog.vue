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
            skillsTemplate: null,
            scoresTemplate: null,
            countTemplate: 0,
            tmpl: {
                labels: {
                    edit: {
                        title: 'Edit stats'
                    }  
                },
                inputs: {
                    sk: {
                        type: 'skills',
                        scores: null,
                        template: null,
                        count: 0,
                    }
                }
            }
        }
    },
    methods: {
        show(edit = false, options = null, extra = null) {
            if (!!extra && !!extra.scores) {

                this.scoresTemplate = extra.scores
                this.skillsTemplate = !!extra.template ? extra.template : []
                this.countTemplate = extra.count
                this.tmpl.inputs.sk.scores = this.scoresTemplate
                this.tmpl.inputs.sk.template = this.skillsTemplate
                this.tmpl.inputs.sk.count = this.countTemplate
                this.tmpl.inputs.sk.profnolevel = extra.profnolevel
            }

            if (!!options) {
                if (!options.sk) {
                    options.sk = []
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