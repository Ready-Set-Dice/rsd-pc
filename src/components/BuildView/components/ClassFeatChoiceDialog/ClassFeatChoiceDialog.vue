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
            abcTemplate: null,
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
                        title: 'Select Class Feat'
                    }  
                },
                inputs: {
                    filter: {
                        label: "Feat Type",
                        type: "select",
                        items: ['Class','Dedication','Archetype','All']
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
            options.filter = 'Class'
            this.filter = options.filter
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
                    options.fchoice = this.$rsd.build.getChosenOption(options.chc, 'class')

                    if (!!options.fchoice) {
                        const item = this.$rsd.build.getFeat(options.fchoice)
                        const object = this.$rsd.build.getFeatObject(item)

                        if (!!object) {
                            this.$set(this.current, 'object', object)

                            // TODO: Set the filter based on the type of fchoice
                            let findItem = this.items.find(i => !!i && !!i.value && i.value == options.fchoice)

                            if (!!findItem) {
                                if (!!findItem.archetype) {
                                    options.filter = 'Archetype'
                                    this.filter = options.filter
                                    this.tmpl.inputs.fchoice.items = this.sortItems(this.items)
                                } else if (!!findItem.dedication) {
                                    options.filter = 'Dedication'
                                    this.filter = options.filter
                                    this.tmpl.inputs.fchoice.items = this.sortItems(this.items)
                                } else if (!!findItem.class) {
                                    options.filter = 'Class'
                                    this.filter = options.filter
                                    this.tmpl.inputs.fchoice.items = this.sortItems(this.items)
                                }
                            }
                        }
                    }
                }
                
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            if (!!this.current.object && !!this.abcTemplate && !!options && !!options.fchoice && (!!options.id || options.id == 0)) {
                // this.$rsd.playercharacters.updateABC(options.id, {a: options.ancestry})
                const category = 'class'
                const type = this.current.object.type
                const parent = this.$rsd.build.getClass(this.abcTemplate.c)._id

                const choiceObj = {
                    val: options.fchoice,
                    type: type,
                    cat: category,
                    pid: parent,
                }

                this.$rsd.playercharacters.updateChoice(options.id, options.level, 'class', choiceObj)
                
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
            this.abcTemplate = null
            this.$set(this.current, 'object', {})
        },
        sortItems(items) {
            let returnItems = []
            if (!!items && !!this.filter) {
                let underList = []
                let overList = []

                items.forEach(i => {
                    if (this.filter == 'All' ||
                        (this.filter == 'Class' && !!i.class) ||
                        (this.filter == 'Archetype' && !!i.archetype) ||
                        (this.filter == 'Dedication' && !!i.dedication)) {
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