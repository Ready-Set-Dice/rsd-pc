<template>
    <BaseWideDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnSelect="onSelect"
    >
        <template v-slot:slot-right>
            <FeatSelectSheet class="alt-scrollbar pb-2" :class="!!rsd.darkmode ? 'theme--dark' : ''" :style="'overflow-y: scroll; height: 60vh;'" :current="current" />
        </template>
    </BaseWideDialog>
</template>

<script>
import BaseWideDialog from '@root/.shared/components/base/BaseDialog/BaseWideDialog'

import FeatSelectSheet from '@root/.shared/components/FeatSelectSheet'

export default {
    components: {
        BaseWideDialog,
        FeatSelectSheet,
    },
    data() {
        return {
            abcTemplate: null,
            sortMode: false,
            items: null,
            level: 1,
            current: {
                object: null,
            },
            tmpl: {
                overflow: 'overflow-hidden',
                labels: {
                    edit: {
                        title: 'Select Heritage'
                    }  
                },
                inputs: {
                    fchoice: {
                        label: "Feat",
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
            this.sortMode = false

            if (!!options && !!options.level) {
                this.level = options.level
            }

            if (!!extra) {
                this.tmpl.inputs.fchoice.items = !!extra.items ? extra.items : []
                this.items = [...extra.items]
                this.tmpl.inputs.fchoice.items = this.sortItems(this.items)
                this.abcTemplate = !!extra.abc ? extra.abc : null
            }

            if (!!this.$refs && !!this.$refs.dialog && !!options) {
                if (!!options.chc) {
                    options.fchoice = this.$rsd.build.getChosenOption(options.chc, 'heritage')

                    if (!!options.fchoice) {
                        const item = this.$rsd.build.getHeritage(options.fchoice)
                        const object = this.$rsd.build.getHeritageObject(item)

                        if (!!object) {
                            this.$set(this.current, 'object', object)
                        }
                    }
                }
                
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            if (!!this.current.object && !!this.abcTemplate && !!options && !!options.fchoice && (!!options.id || options.id == 0)) {
                // this.$rsd.playercharacters.updateABC(options.id, {a: options.ancestry})
                const category = 'ancestry'
                const type = this.current.object.type
                const parent = this.$rsd.build.getAncestry(this.abcTemplate.a)._id

                const choiceObj = {
                    val: options.fchoice,
                    type: type,
                    cat: category,
                    pid: parent,
                }

                this.$rsd.playercharacters.updateChoice(options.id, options.level, 'heritage', choiceObj)
                
                this.reset()
            }
        },
        onSelect(options) {
            if (!!options && !!options.fchoice) {
                const item = this.$rsd.build.getHeritage(options.fchoice)
                const object = this.$rsd.build.getHeritageObject(item)

                if (!!object) {
                    this.$set(this.current, 'object', object)
                }
            }
        },
        reset() {
            this.abcTemplate = null
            this.$set(this.current, 'object', {})
        },
        sortItems(items) {
            let returnItems = []
            if (!!items) {
                returnItems = [...items]
                returnItems.sort(this.$rsd.format.compareByText)
            }
            return returnItems
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