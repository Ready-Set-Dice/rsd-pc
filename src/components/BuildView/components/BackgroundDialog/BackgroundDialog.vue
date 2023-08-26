<template>
    <BaseWideDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
        @OnSelect="onSelect"
    >
        <template v-slot:slot-right>
            <BackgroundSheet class="alt-scrollbar pb-2" :style="'overflow-y: scroll; height: 60vh;'" :current="current" />
        </template>
    </BaseWideDialog>
</template>

<script>
import BaseWideDialog from '@root/.shared/components/base/BaseDialog/BaseWideDialog'
import BaseItemNode from '@root/.shared/components/base/BaseItemNode'
import BaseTraitChip from '@root/.shared/components/base/BaseTraitChip'
import BaseTraitText from '@root/.shared/components/base/BaseTraitText'

import BackgroundSheet from '@root/.shared/components/BuildSheet/BackgroundSheet'

export default {
    components: {
        BaseWideDialog,
        BaseItemNode,
        BaseTraitChip,
        BaseTraitText,
        BackgroundSheet,
    },
    data() {
        return {
            current: {
                object: null,
            },
            tmpl: {
                cols_left: 4,
                cols_right: 8,
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
                        container_class: 'virtual-scroll-container',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            options.filter = 'Common'
            this.tmpl.inputs.background.items = this.$rsd.build.getBackgroundsByRarity(options.filter)

            if (!!this.$refs && !!this.$refs.dialog) {

                if (!!options && !!options.abc && !!options.abc.b) {
                    options.background = options.abc.b

                    const background = this.$rsd.build.getBackground(options.background)
                    const object = this.$rsd.build.getBackgroundObject(background)

                    if (!!object) {
                        this.$set(this.current, 'object', object)
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
                // Retrieve the full background based on the id
                const background = this.$rsd.build.getBackground(options.background)
                if (!!background) {
                    // Get a distilled object containing only the traits, rarity, size and mechanics
                    // console.log(background)
                    const object = this.$rsd.build.getBackgroundObject(background)

                    if (!!object) {
                        this.$set(this.current, 'object', object)
                    }
                }
            }
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