<template>
    <BaseWideDialogMobile 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
        @OnSelect="onSelect"
    >
        <template v-slot:slot-right>
            <AncestrySheet :current="current" />
        </template>
    </BaseWideDialogMobile>
</template>

<script>
import BaseWideDialogMobile from '@root/.shared/components/base/BaseDialog/BaseWideDialogMobile'

import AncestrySheet from '@root/.shared/components/BuildSheet/AncestrySheet'

export default {
    components: {
        AncestrySheet,
        BaseWideDialogMobile,
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
                        title: 'Select Ancestry'
                    },
                    edit: {
                        title: 'Select Ancestry'
                    }  
                },
                inputs: {
                    filter: {
                        label: "Rarity",
                        type: "select",
                        items: ['Common','Uncommon','Rare','All']
                    },
                    ancestry: {
                        label: "Ancestry",
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
            this.tmpl.inputs.ancestry.items = this.$rsd.build.getAncestriesByRarity(options.filter)
            this.tmpl.overlay = false

            if (!!this.$refs && !!this.$refs.dialog) {

                options.filter = 'Common'

                if (!!options && !!options.abc && !!options.abc.a) {
                    options.ancestry = options.abc.a

                    const object = this.setValues(options.ancestry)

                    if (!!object) {
                        options.filter = this.$rsd.format.capitalize(object.rarity)

                        this.tmpl.inputs.ancestry.items = this.$rsd.build.getAncestriesByRarity(options.filter)
                    }
                }
                
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            // console.log('options', options)
            if (!!options && !!options.ancestry && (!!options.id || options.id == 0)) {
                this.$rsd.playercharacters.updateABC(options.id, {a: options.ancestry})
            }
        },
        onChange(options) {
            // This should only trigger on the filter change
            if (!!options) {
                this.tmpl.inputs.ancestry.items = this.$rsd.build.getAncestriesByRarity(options.filter)
            }
        },
        onSelect(options) {
            // Check that the ancestry option is set
            if (!!options && !!options.ancestry) {
                if (!!this.setValues(options.ancestry)){
                    this.tmpl.overlay = true
                }
            }
        },
        onBackClick() {
            this.tmpl.overlay = false
        },
        onLeftClick() {
            const itemIndex = this.tmpl.inputs.ancestry.items.findIndex((i) => i.value == this.current.id)
            if (itemIndex != -1) {
                const newIndex = itemIndex == 0 ? this.tmpl.inputs.ancestry.items.length - 1 : itemIndex - 1
                if (!!this.tmpl.inputs.ancestry.items[newIndex] && !!this.tmpl.inputs.ancestry.items[newIndex].value) {
                    this.setValues(this.tmpl.inputs.ancestry.items[newIndex].value)
                }
            }
        },
        onRightClick() {
            const itemIndex = this.tmpl.inputs.ancestry.items.findIndex((i) => i.value == this.current.id)
            if (itemIndex != -1) {
                const newIndex = itemIndex == this.tmpl.inputs.ancestry.items.length - 1 ? 0 : itemIndex + 1
                if (!!this.tmpl.inputs.ancestry.items[newIndex] && !!this.tmpl.inputs.ancestry.items[newIndex].value) {
                    this.setValues(this.tmpl.inputs.ancestry.items[newIndex].value)
                }
            }
        },
        setValues(id) {
            // Check that the id is set
            if (!!id) {
                // Set the internal ancestry item to id
                this.$refs.dialog.setOption("ancestry",id)
                // Retrieve the full ancestry based on the id
                const ancestry = this.$rsd.build.getAncestry(id)
                if (!!ancestry) {
                    // Get a distilled object containing only the traits, rarity, size and mechanics
                    const object = this.$rsd.build.getAncestryObject(ancestry)

                    if (!!object) {
                        this.$set(this.current, 'object', object)
                        this.current.id = id
                        this.tmpl.overlay_title = ancestry.name

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