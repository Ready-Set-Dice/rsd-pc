<template>
    <BaseWideDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
        @OnSelect="onSelect"
    >
        <template v-slot:slot-right>
            <AncestrySheet class="alt-scrollbar pb-2" :style="'overflow-y: scroll; height: 60vh;'" :current="current" />
        </template>
    </BaseWideDialog>
</template>

<script>
import BaseWideDialog from '@root/.shared/components/base/BaseDialog/BaseWideDialog'

import AncestrySheet from '@root/.shared/components/BuildSheet/AncestrySheet'

export default {
    components: {
        AncestrySheet,
        BaseWideDialog,
    },
    data() {
        return {
            current: {
                object: null,
            },
            tmpl: {
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
                        container_class: 'virtual-scroll-container',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            options.filter = 'Common'
            this.tmpl.inputs.ancestry.items = this.$rsd.build.getAncestriesByRarity(options.filter)

            if (!!this.$refs && !!this.$refs.dialog) {

                if (!!options && !!options.abc && !!options.abc.a) {
                    options.ancestry = options.abc.a

                    const ancestry = this.$rsd.build.getAncestry(options.ancestry)
                    const object = this.$rsd.build.getAncestryObject(ancestry)

                    if (!!object) {
                        this.$set(this.current, 'object', object)
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
                // Retrieve the full ancestry based on the id
                const ancestry = this.$rsd.build.getAncestry(options.ancestry)
                if (!!ancestry) {
                    // Get a distilled object containing only the traits, rarity, size and mechanics
                    const object = this.$rsd.build.getAncestryObject(ancestry)

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