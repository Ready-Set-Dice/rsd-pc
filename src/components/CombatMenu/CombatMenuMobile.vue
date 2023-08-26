<template>
    <div class="fill-height width-100">
        <div class="d-flex flex-column fill-height">
            <div class="flex-row fill-height d-flex content-list alt-scrollbar">
                <v-list
                    dense
                    class="d-flex flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                >
                    <v-list-item
                        class="pl-2 pr-4 py-1 no-flex accent-item list_odd"
                        :ripple="false"
                    >
                        <v-list-item-content class="py-0">
                            <v-list-item-title>
                                <span>Current combat</span>
                            </v-list-item-title>
                            <v-list-item-subtitle class="d-flex">
                                <span class="mr-2">Round: {{cround}}</span>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <transition-group type="transition" :name="'flip-list'">
                        <div v-for="(member, index) in combatantsArray" :key="'member-'+index">
                            <CombatListItem :member="member" :index="index" :initiative="initiative" :localCharacter="localCharacter" />
                            <div v-show="!!member.conditions">
                                <v-list-item
                                    :key="'cm-conditions-'+member.id"
                                    class="list_odd"
                                >
                                    <transition-group name="condition" class="row my-1">
                                        <template v-for="(cvalue, cindex) in member.conditions">
                                            <v-col :key="'cindex-'+cindex" class="py-0 px-0 flex-grow-0">
                                                <v-card outlined>
                                                    <ConditionIndicator :condition="cvalue" :label="false" />
                                                </v-card>
                                            </v-col>
                                        </template>
                                    </transition-group>
                                </v-list-item>
                            </div>
                        </div>
                    </transition-group>
                </v-list>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'

import CombatListItem from '@root/.shared/components/CombatListItem/CombatListItem'

import ConditionIndicator from '@root/.shared/components/ConditionIndicator'

export default {
    props: {
        menu: Object,
        localCharacter: Object,
    },
    components: {
        CombatListItem,
        ConditionIndicator,
        draggable,
    },
    data() {
        return {
            levels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],

            selecting: false,

            playerDrag: false,
            showCombat: false,
            showBlocks: false,

            playercharacters: {
                width: () => {
                    return this.initiative.width
                },
                selectPlayerCharacter: (playercharacter, id) => {
                    if (!!playercharacter._key && this.$rsd.playercharacters.activeKey != playercharacter._key) {
                        this.showBuilder = false
                        this.showBlocks = false
                        this.$rsd.playercharacters.activeKey = playercharacter._key
                    }
                    this.toggleSelection(false)
                },
            },

            initiative: {
                width: 452,
                prevWidth: 452,
                startX: null,
                selected: [],
                contextSelected: null,
                contextmenu: (event, member, index) => {
                    event.preventDefault()

                    // TODO: Currently only allow the PC to do actions on themselves. Add option for GM to decide this later
                    if (this.$rsd.playercharacters.activeKey == member.id) {

                        if (!this.initiative.selected || this.initiative.selected.length <= 1 || this.initiative.selected.findIndex(s => s._key == index) == -1) {
                            this.$rsd.combat.target = {...member, _key: index}
                            this.initiative.selected = [{...member, _key: index}]
                        }

                        this.closeContextMenus()

                        
                        const clickX = event.clientX
                        const clickY = event.clientY
        
                        if (this.initiative.selected.length == 1) {
                            this.getDialog('combatContextMenu').show(clickX, clickY, {width: 225, isNPC: member.type == 'npc', selected: this.initiative.selected[0]});
                        } else if (this.initiative.selected.length > 1) {
                            // this.getDialog('multiInitiativeMenu').show(clickX, clickY, {width: 200});
                        }
                    }
                },
                click: (event, member, index) => {
                    if (!this.initiative.selected || this.initiative.selected.length == 0) {
                        this.$rsd.combat.target = {...member, _key: index}
                        this.initiative.selected = [{...member, _key: index}]
                    }

                    // if (!!event && !!event.shiftKey) {
                    //     const startIndex = this.initiative.selected[0]._key
                    //     const endIndex = index

                    //     let newSelected = []

                    //     //combatantsArray
                    //     if (startIndex <= endIndex) {
                    //         let i = startIndex
                    //         while(i <= endIndex) {
                    //             newSelected.push({...this.combatantsArray[i], _key: i})
                    //             i+=1
                    //         }
                    //     } else {
                    //         let i = startIndex
                    //         while(i >= endIndex) {
                    //             newSelected.push({...this.combatantsArray[i], _key: i})
                    //             i-=1
                    //         }
                    //     }
                    //     this.initiative.selected = newSelected
                    // } else if (!!event && !!event.ctrlKey) {
                    //     const initIndex = this.initiative.selected.findIndex(s => s._key == index)
                    //     if (initIndex != -1) {
                    //         this.initiative.selected.splice(initIndex, 1)
                    //     } else {
                    //         this.initiative.selected.push({...member, _key: index})
                    //     }
                    // } else 
                    else if (!!event) {
                        this.$rsd.combat.target = {...member, _key: index}
                        this.initiative.selected = [{...member, _key: index}]
                    }

                    setTimeout(() => {
                        this.$store.dispatch('rsd/setMobileView', {
                            ...this.mobileView,
                            combatantSelected: true,
                        })
                    }, 100)
                },
                checkSelected: (member, index) => {
                    return this.initiative.selected.findIndex(s => s._key == index) != -1
                },
                class: (member, index) => {
                    if (index == this.combat.curInit) {
                        return 'accent-current'
                    } else {
                        return !!this.initiative.checkSelected(member, index) ? 'accent-selected' : ''
                    }
                },
            },
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            }
        },
    },
    methods: {
        toggleSelection(value) {
            if (!!this.$rsd.playercharacters.activeKey) {
                this.selecting = value
            }
        },

        /* Set visible functions */

        /* Listeners */
        onBuilderTransitionAfterLeave() {
            setTimeout(() => {
                this.showCombat = true
            }, 75)
        },
        onBlocksTransitionAfterLeave() {
            setTimeout(() => {
                this.showBlocks = true
            }, 75)
        },

        closeContextMenus() {
            this.getDialog('playerCharacterContextMenu').close()
        },

        /* Dialogs */

        getObject(combatant, modifier = 0) {
            if (combatant.type == 'npc' || combatant.type == 'hazard') {
                return !!combatant.bid ? this.$rsd.bestiary.getObject(combatant.bid, modifier) : null
            } else {
                return !!combatant ? this.$rsd.members.getObject(combatant) : null
            }
        },
    },
    created() {
    },
    destroyed() {
    },
    mounted() {
        setTimeout(() => {
            this.showCombat = true
            this.showBlocks = true

            if (!this.$rsd.playercharacters.activeKey) {
                this.selecting = true
            }
        }, 50)
    },
}
</script>

<style lang="less" scoped>
.right-border {
    border-right-color: rgba(0, 0, 0, 0.12) !important;
    border-right-style: solid;
    border-right-width: 1px;
}

.no-flex {
    flex: none;
}

.icon-offset {
    top: -2px;
}

.content-list {
    height: calc(~"100vh - 144px");
    overflow-y: auto;
}

.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
}

.quick-fade-enter-active {
    transition: all 0.1s ease;
}
.quick-fade-leave-active {
    transition: all 0.1s ease;
}
.quick-fade-enter, .quick-fade-leave-to {
    opacity: 0;
}

.list-header {
    position: sticky;
    z-index: 1;
    top: 0;
}
</style>