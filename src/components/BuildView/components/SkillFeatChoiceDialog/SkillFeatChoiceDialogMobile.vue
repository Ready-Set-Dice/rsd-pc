<template>
    <BaseWideDialogMobile 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
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
            sortMode: false,
            items: null,
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
                        title: 'Select Skill Feat'
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
            this.tmpl.overlay = false

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
                    options.fchoice = this.$rsd.build.getChosenOption(options.chc, 'skill')

                    if (!!options.fchoice) {
                        this.setValues(options.fchoice)
                    }
                }
                
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            if (!!this.current.object && !!options && !!options.fchoice && (!!options.id || options.id == 0)) {
                const category = 'skill'
                const type = this.current.object.type

                const choiceObj = {
                    val: options.fchoice,
                    type: type,
                    cat: category,
                }

                this.$rsd.playercharacters.updateChoice(options.id, options.level, 'skill', choiceObj)
                
                this.reset()
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
            this.$set(this.current, 'object', {})
        },
        sortItems(items) {
            let returnItems = []
            if (!!items) {
                let underList = []
                let overList = []

                items.forEach(i => {
                    if (!!i && !!i.level) {
                        if (i.level <= this.level && !!i.allowed) {
                            underList.push(i)
                        } else {
                            overList.push(i)
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