<template>
    <BaseWideDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
        @OnSelect="onSelect"
    >
        <template v-slot:title-bar>
            <v-btn icon @click="toggleSort">
                <v-icon>{{!!sortMode ? 'mdi-sort-alphabetical-ascending' : 'mdi-sort-numeric-ascending'}}</v-icon>
            </v-btn>
        </template>
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
            sortMode: false,
            items: null,
            filter: 'All',
            level: 1,
            current: {
                object: null,
            },
            tmpl: {
                overflow: 'overflow-hidden',
                labels: {
                    edit: {
                        title: 'Select General Feat'
                    }  
                },
                inputs: {
                    filter: {
                        label: "Feat Type",
                        type: "select",
                        items: ['All','General','Skill']
                    },
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
            options.filter = 'All'
            this.filter = options.filter
            this.sortMode = false

            if (!!options && !!options.level) {
                this.level = options.level
            }


            if (!!extra) {
                this.tmpl.inputs.fchoice.items = !!extra.items ? extra.items : []
                this.items = [...extra.items]
                this.tmpl.inputs.fchoice.items = this.sortItems(this.items)
            }

            if (!!this.$refs && !!this.$refs.dialog && !!options) {
                if (!!options.chc) {
                    options.fchoice = this.$rsd.build.getChosenOption(options.chc, 'general')

                    if (!!options.fchoice) {
                        const item = this.$rsd.build.getFeat(options.fchoice)
                        const object = this.$rsd.build.getFeatObject(item)

                        if (!!object) {
                            this.$set(this.current, 'object', object)
                        }
                    }
                }
                
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            if (!!this.current.object && !!options && !!options.fchoice && (!!options.id || options.id == 0)) {
                const category = 'general'
                const type = this.current.object.type

                const choiceObj = {
                    val: options.fchoice,
                    type: type,
                    cat: category,
                }

                this.$rsd.playercharacters.updateChoice(options.id, options.level, 'general', choiceObj)
                
                this.reset()
            }
        },
        onChange(options) {
            // This should only trigger on the filter change
            if (!!options) {
                this.filter = options.filter
                this.tmpl.inputs.fchoice.items = this.sortItems(this.items)
                // this.tmpl.inputs.ancestry.items = this.$rsd.build.getAncestriesByRarity(options.filter)
            }
        },
        onSelect(options) {
            if (!!options && !!options.fchoice) {
                const item = this.$rsd.build.getFeat(options.fchoice)
                const object = this.$rsd.build.getFeatObject(item)

                if (!!object) {
                    this.$set(this.current, 'object', object)
                }
            }
        },
        reset() {
            this.$set(this.current, 'object', {})
        },
        sortItems(items) {
            let returnItems = []
            if (!!items && !!this.filter) {
                let underList = []
                let overList = []

                items.forEach(i => {
                    if (this.filter == 'All' ||
                        (this.filter == 'General' && !!i.general) ||
                        (this.filter == 'Skill' && !!i.skill)) {
                        if (!!i && !!i.level) {
                            if (i.level <= this.level && !!i.allowed) {
                                underList.push(i)
                            } else {
                                overList.push(i)
                            }
                        }
                    }
                })

                if (!!underList && underList.length > 0) {
                    underList.sort(!!this.sortMode ? this.$rsd.format.compareByText : this.$rsd.format.compareByLevel)
                }
                if (!!overList && overList.length > 0) {
                    overList.sort(!!this.sortMode ? this.$rsd.format.compareByText : this.$rsd.format.compareByLevel)
                }
                returnItems = underList.concat(overList)
            }
            return returnItems
        },
        toggleSort() {
            this.sortMode = !this.sortMode
            this.tmpl.inputs.fchoice.items = this.sortItems(this.items)
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