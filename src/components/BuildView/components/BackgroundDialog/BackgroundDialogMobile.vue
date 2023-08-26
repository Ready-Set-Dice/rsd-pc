<template>
    <BaseWideDialogMobile 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
        @OnSelect="onSelect"
    >
        <template v-slot:slot-right>
            <BackgroundSheet :current="current" />
        </template>
    </BaseWideDialogMobile>
</template>

<script>
import BaseWideDialogMobile from '@root/.shared/components/base/BaseDialog/BaseWideDialogMobile'
import BaseItemNode from '@root/.shared/components/base/BaseItemNode'
import BaseTraitChip from '@root/.shared/components/base/BaseTraitChip'
import BaseTraitText from '@root/.shared/components/base/BaseTraitText'

import BackgroundSheet from '@root/.shared/components/BuildSheet/BackgroundSheet'

export default {
    components: {
        BaseWideDialogMobile,
        BaseItemNode,
        BaseTraitChip,
        BaseTraitText,
        BackgroundSheet,
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
                overlay_type: 'ancestry',
                overlay_back: this.onBackClick,
                overlay_left: this.onLeftClick,
                overlay_right: this.onRightClick,
                overflow: 'overflow-hidden',
                name: 'playercharacter-dialog',
                labels: {
                    new: {
                        title: 'Select Background'
                    },
                    edit: {
                        title: 'Select Background'
                    }  
                },
                inputs: {
                    filter: {
                        label: "Rarity",
                        type: "select",
                        items: ['Common','Uncommon','Rare','All']
                    },
                    background: {
                        label: "Background",
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
            this.tmpl.inputs.background.items = this.$rsd.build.getBackgroundsByRarity(options.filter)
            this.tmpl.overlay = false

            if (!!this.$refs && !!this.$refs.dialog) {

                if (!!options && !!options.abc && !!options.abc.b) {
                    options.background = options.abc.b

                    const object = this.setValues(options.background)

                    if (!!object) {
                        options.filter = this.$rsd.format.capitalize(object.rarity)

                        this.tmpl.inputs.background.items = this.$rsd.build.getBackgroundsByRarity(options.filter)
                    }
                }
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            if (!!options && !!options.background && (!!options.id || options.id == 0)) {
                this.$rsd.playercharacters.updateABC(options.id, {b: options.background})
            }
        },
        onChange(options) {
            // This should only trigger on the filter change
            if (!!options) {
                this.tmpl.inputs.background.items = this.$rsd.build.getBackgroundsByRarity(options.filter)
            }
        },
        onSelect(options) {
            // Check that the background option is set
            if (!!options && !!options.background) {
                if (!!this.setValues(options.background)){
                    this.tmpl.overlay = true
                }
            }
        },
        onBackClick() {
            this.tmpl.overlay = false
        },
        onLeftClick() {
            const itemIndex = this.tmpl.inputs.background.items.findIndex((i) => i.value == this.current.id)
            if (itemIndex != -1) {
                const newIndex = itemIndex == 0 ? this.tmpl.inputs.background.items.length - 1 : itemIndex - 1
                if (!!this.tmpl.inputs.background.items[newIndex] && !!this.tmpl.inputs.background.items[newIndex].value) {
                    this.setValues(this.tmpl.inputs.background.items[newIndex].value)
                }
            }
        },
        onRightClick() {
            const itemIndex = this.tmpl.inputs.background.items.findIndex((i) => i.value == this.current.id)
            if (itemIndex != -1) {
                const newIndex = itemIndex == this.tmpl.inputs.background.items.length - 1 ? 0 : itemIndex + 1
                if (!!this.tmpl.inputs.background.items[newIndex] && !!this.tmpl.inputs.background.items[newIndex].value) {
                    this.setValues(this.tmpl.inputs.background.items[newIndex].value)
                }
            }
        },
        setValues(id) {
            // Check that the id is set
            if (!!id) {
                // Set the internal background item to id
                this.$refs.dialog.setOption("background",id)
                // Retrieve the full background based on the id
                const background = this.$rsd.build.getBackground(id)
                if (!!background) {
                    // Get a distilled object containing only the traits, rarity, size and mechanics
                    const object = this.$rsd.build.getBackgroundObject(background)

                    if (!!object) {
                        this.$set(this.current, 'object', object)
                        this.current.id = id
                        this.tmpl.overlay_title = background.name

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