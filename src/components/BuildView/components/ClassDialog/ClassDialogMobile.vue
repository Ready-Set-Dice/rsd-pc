<template>
    <BaseWideDialogMobile 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
        @OnSelect="onSelect"
    >
        <template v-slot:slot-right>
            <ClassSheet :current="current" />
        </template>
    </BaseWideDialogMobile>
</template>

<script>
import BaseWideDialogMobile from '@root/.shared/components/base/BaseDialog/BaseWideDialogMobile'
import BaseItemNode from '@root/.shared/components/base/BaseItemNode'
import BaseTraitChip from '@root/.shared/components/base/BaseTraitChip'
import BaseTraitText from '@root/.shared/components/base/BaseTraitText'

import ClassSheet from '@root/.shared/components/BuildSheet/ClassSheet'

export default {
    components: {
        BaseWideDialogMobile,
        BaseItemNode,
        BaseTraitChip,
        BaseTraitText,
        ClassSheet,
    },
    data() {
        return {
            current: {
                object: null,
                id: null,
            },
            tmpl: {
                overlay: false,
                overlay_title: '',
                overlay_type: 'class',
                overlay_back: this.onBackClick,
                overlay_left: this.onLeftClick,
                overlay_right: this.onRightClick,
                overflow: 'overflow-hidden',
                name: 'playercharacter-dialog',
                labels: {
                    new: {
                        title: 'Select Class'
                    },
                    edit: {
                        title: 'Select Class'
                    }  
                },
                inputs: {
                    filter: {
                        label: "Rarity",
                        type: "select",
                        items: ['Common','Uncommon','All']
                    },
                    class: {
                        label: "Class",
                        type: "virtual-scroll",
                        benched: 50,
                        item_height: 24,
                        items: [],
                        container_class: 'virtual-scroll-container-mobile',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            options.filter = 'Common'
            this.tmpl.inputs.class.items = this.$rsd.build.getClassesByRarity(options.filter)
            this.tmpl.overlay = false

            if (!!this.$refs && !!this.$refs.dialog) {

                if (!!options && !!options.abc && !!options.abc.c) {
                    options.class = options.abc.c

                    const object = this.setValues(options.class)

                    if (!!object) {
                        options.filter = this.$rsd.format.capitalize(object.rarity)

                        this.tmpl.inputs.class.items = this.$rsd.build.getClassesByRarity(options.filter)
                    }
                }
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            if (!!options && !!options.class && (!!options.id || options.id == 0)) {
                this.$rsd.playercharacters.updateABC(options.id, {c: options.class})
            }
        },
        onChange(options) {
            // This should only trigger on the filter change
            if (!!options) {
                this.tmpl.inputs.class.items = this.$rsd.build.getClassesByRarity(options.filter)
            }
        },
        onSelect(options) {
            // Check that the class option is set
            if (!!options && !!options.class) {
                if (!!this.setValues(options.class)){
                    this.tmpl.overlay = true
                }
            }
        },
        onBackClick() {
            this.tmpl.overlay = false
        },
        onLeftClick() {
            const itemIndex = this.tmpl.inputs.class.items.findIndex((i) => i.value == this.current.id)
            if (itemIndex != -1) {
                const newIndex = itemIndex == 0 ? this.tmpl.inputs.class.items.length - 1 : itemIndex - 1
                if (!!this.tmpl.inputs.class.items[newIndex] && !!this.tmpl.inputs.class.items[newIndex].value) {
                    this.setValues(this.tmpl.inputs.class.items[newIndex].value)
                }
            }
        },
        onRightClick() {
            const itemIndex = this.tmpl.inputs.class.items.findIndex((i) => i.value == this.current.id)
            if (itemIndex != -1) {
                const newIndex = itemIndex == this.tmpl.inputs.class.items.length - 1 ? 0 : itemIndex + 1
                if (!!this.tmpl.inputs.class.items[newIndex] && !!this.tmpl.inputs.class.items[newIndex].value) {
                    this.setValues(this.tmpl.inputs.class.items[newIndex].value)
                }
            }
        },
        setValues(id) {
            // Check that the id is set
            if (!!id) {
                // Set the internal class item to id
                this.$refs.dialog.setOption("class",id)
                // Retrieve the full class based on the id
                const clss = this.$rsd.build.getClass(id)
                if (!!clss) {
                    // Get a distilled object containing only the traits, rarity, size and mechanics
                    const object = this.$rsd.build.getClassObject(clss)

                    if (!!object) {
                        this.$set(this.current, 'object', object)
                        this.current.id = id
                        this.tmpl.overlay_title = clss.name

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