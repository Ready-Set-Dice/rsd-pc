<template>
    <BaseWideDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnSelect="onSelect"
    >
        <template v-slot:slot-right>
            <ClassFeatureSelectSheet class="alt-scrollbar pb-2" :class="!!rsd.darkmode ? 'theme--dark' : ''" :style="'overflow-y: scroll; height: 60vh;'" :current="current" />
            <DeitySelectSheet class="alt-scrollbar pb-2" :class="!!rsd.darkmode ? 'theme--dark' : ''" :style="'overflow-y: scroll; height: 60vh;'" :current="current" />
            <DomainSelectSheet class="alt-scrollbar pb-2" :class="!!rsd.darkmode ? 'theme--dark' : ''" :style="'overflow-y: scroll; height: 60vh;'" :current="current" />
            <FeatureSelectSheet class="alt-scrollbar pb-2" :class="!!rsd.darkmode ? 'theme--dark' : ''" :style="'overflow-y: scroll; height: 60vh;'" :current="current" />
        </template>
    </BaseWideDialog>
</template>

<script>
import BaseWideDialog from '@root/.shared/components/base/BaseDialog/BaseWideDialog'

import ClassFeatureSelectSheet from './ClassFeatureSelectSheet'
import DeitySelectSheet from './DeitySelectSheet'
import DomainSelectSheet from './DomainSelectSheet'
import FeatureSelectSheet from './FeatureSelectSheet'

export default {
    components: {
        BaseWideDialog,
        ClassFeatureSelectSheet,
        DeitySelectSheet,
        DomainSelectSheet,
        FeatureSelectSheet,
    },
    data() {
        return {
            searchFunction: null,
            objectFunction: null,
            featureTemplate: null,
            abcTemplate: null,
            current: {
                object: null,
            },
            tmpl: {
                overflow: 'overflow-hidden',
                labels: {
                    edit: {
                        title: 'Select Feat'
                    }  
                },
                inputs: {
                    fchoice: {
                        label: "Choose a",
                        type: "virtual-scroll",
                        benched: 50,
                        item_height: 24,
                        items: [],
                        container_class: 'virtual-scroll-container',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}, extra = {}) {
            if (!!extra) {
                this.tmpl.inputs.fchoice.label = !!extra.feature ? "Choose a " + extra.feature.name : "Make a choice"
                this.tmpl.inputs.fchoice.items = !!extra.items ? extra.items : []
                this.searchFunction = !!extra.searchFunction && typeof(extra.searchFunction) == 'function' ? extra.searchFunction : null
                this.objectFunction = !!extra.objectFunction && typeof(extra.objectFunction) == 'function' ? extra.objectFunction : null
                this.featureTemplate = !!extra.feature ? extra.feature : null
                this.abcTemplate = !!extra.abc ? extra.abc : null
            }

            if (!!this.$refs && !!this.$refs.dialog && !!options) {
                if (!!options.chc && !!this.featureTemplate && !!this.featureTemplate._id) {
                    options.fchoice = this.$rsd.build.getChosenOption(options.chc, this.featureTemplate._id)
                }

                if (!!options.fchoice && !!this.searchFunction && !!this.objectFunction) {
                    const item = this.searchFunction(options.fchoice)
                    const object = this.objectFunction(item)

                    if (!!object) {
                        this.$set(this.current, 'object', object)
                    }
                }
                
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            if (!!this.featureTemplate && !!this.featureTemplate.system && !!this.featureTemplate.system.category && !!this.current.object && !!this.abcTemplate && !!options && !!options.fchoice && (!!options.id || options.id == 0)) {
                // this.$rsd.playercharacters.updateABC(options.id, {a: options.ancestry})
                const category = this.featureTemplate.system.category
                const type = this.current.object.type
                let parent = ''
                if ((category == 'classfeature' || category == 'class') && this.abcTemplate.c) {
                    const parentObj = this.$rsd.build.getClass(this.abcTemplate.c)
                    parent = parentObj._id
                } else if (category == '?') {
                }

                const choiceObj = {
                    val: options.fchoice,
                    type: type,
                    cat: category,
                    pid: parent,
                }

                this.$rsd.playercharacters.updateChoice(options.id, options.level, this.featureTemplate._id, choiceObj)
                
                this.reset()
            }
        },
        onSelect(options) {
            if (!!options && !!options.fchoice && !!this.searchFunction && !!this.objectFunction) {
                const item = this.searchFunction(options.fchoice)
                const object = this.objectFunction(item)

                if (!!object) {
                    this.$set(this.current, 'object', object)
                }
            }
        },
        reset() {
            this.searchFunction = null
            this.objectFunction = null
            this.featureTemplate = null
            this.abcTemplate = null
            this.$set(this.current, 'object', {})
        },
    }
}
</script>

<style lang="less" scoped>
.dialog-description {
    height: calc(~"60vh - 55px");
    overflow-y: scroll;
}
</style>