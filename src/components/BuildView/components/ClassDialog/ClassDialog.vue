<template>
    <BaseWideDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
        @OnSelect="onSelect"
    >
        <template v-slot:slot-right>
            <ClassSheet class="alt-scrollbar pb-2" :style="'overflow-y: scroll; height: 60vh;'" :current="current" />
        </template>
    </BaseWideDialog>
</template>

<script>
import BaseWideDialog from '@root/.shared/components/base/BaseDialog/BaseWideDialog'
import BaseItemNode from '@root/.shared/components/base/BaseItemNode'
import BaseTraitChip from '@root/.shared/components/base/BaseTraitChip'
import BaseTraitText from '@root/.shared/components/base/BaseTraitText'

import ClassSheet from '@root/.shared/components/BuildSheet/ClassSheet'

export default {
    components: {
        BaseWideDialog,
        BaseItemNode,
        BaseTraitChip,
        BaseTraitText,
        ClassSheet,
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
                        container_class: 'virtual-scroll-container',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            options.filter = 'Common'
            this.tmpl.inputs.class.items = this.$rsd.build.getClassesByRarity(options.filter)

            if (!!this.$refs && !!this.$refs.dialog) {

                if (!!options && !!options.abc && !!options.abc.c) {
                    options.class = options.abc.c

                    const clss = this.$rsd.build.getClass(options.class)
                    const object = this.$rsd.build.getClassObject(clss)

                    if (!!object) {
                        this.$set(this.current, 'object', object)
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
                // Retrieve the full class based on the id
                const clss = this.$rsd.build.getClass(options.class)
                if (!!clss) {
                    // Get a distilled object containing only the traits, rarity, size and mechanics
                    // console.log(clss)
                    const object = this.$rsd.build.getClassObject(clss)

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