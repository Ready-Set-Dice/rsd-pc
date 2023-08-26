<template>
    <BaseWideDialogMobile 
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
    </BaseWideDialogMobile>
</template>

<script>
import BaseWideDialogMobile from '@root/.shared/components/base/BaseDialog/BaseWideDialogMobile'

import FeatSelectSheet from '@root/.shared/components/FeatSelectSheet'

export default {
    components: {
        BaseWideDialogMobile,
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
                id: null,
            },
            tmpl: {
                overlay: false,
                overlay_title: '',
                overlay_type: 'ancestry',
                overlay_back: this.onBackClick,
                overlay_left: this.onLeftClick,
                overlay_right: this.onRightClick,
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
            this.tmpl.overlay = false

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
                        const object = this.setValues(options.fchoice)

                        if (!!object) {
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
                if (!!this.setValues(options.fchoice)){
                    this.tmpl.overlay = true
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
        onBackClick() {
            this.tmpl.overlay = false
        },
        onLeftClick() {
            const itemIndex = this.tmpl.inputs.fchoice.items.findIndex((i) => i.value == this.current.id)
            if (itemIndex != -1) {
                const newIndex = itemIndex == 0 ? this.tmpl.inputs.fchoice.items.length - 1 : itemIndex - 1
                if (!!this.tmpl.inputs.fchoice.items[newIndex] && !!this.tmpl.inputs.fchoice.items[newIndex].value) {
                    this.setValues(this.tmpl.inputs.fchoice.items[newIndex].value)
                }
            }
        },
        onRightClick() {
            const itemIndex = this.tmpl.inputs.fchoice.items.findIndex((i) => i.value == this.current.id)
            if (itemIndex != -1) {
                const newIndex = itemIndex == this.tmpl.inputs.fchoice.items.length - 1 ? 0 : itemIndex + 1
                if (!!this.tmpl.inputs.fchoice.items[newIndex] && !!this.tmpl.inputs.fchoice.items[newIndex].value) {
                    this.setValues(this.tmpl.inputs.fchoice.items[newIndex].value)
                }
            }
        },
        setValues(id) {
            // Check that the id is set
            if (!!id) {
                // Set the internal feat item to id
                this.$refs.dialog.setOption("fchoice", id)
                // Retrieve the full feat based on the id
                const item = this.$rsd.build.getFeat(id)
                if (!!item) {
                    // Get a distilled object containing only the traits, rarity, size and mechanics
                    const object = this.$rsd.build.getFeatObject(item)

                    if (!!object) {
                        this.$set(this.current, 'object', object)
                        this.current.id = id
                        this.tmpl.overlay_title = item.name

                        return object
                    }
                } else {
                    return null
                }
            } else {
                return null
            }
        }
    }
}
</script>

<style lang="less" scoped>
.dialog-description {
    height: calc(~"60vh - 55px");
    overflow-y: scroll;
}
</style>