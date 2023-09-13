<template>
    <div class="fill-height">
        <div class="d-flex flex-column fill-height">
            <v-list
                dense
                class="d-flex flex-grow-1 py-0 right-border"
            >
                <v-list-item
                    link 
                    class="pl-2 pr-4 py-1" 
                    @click="toggleSelection(true)"
                    @contextmenu="playercharacters.contextmenu($event, $rsd.playercharacters.active, $rsd.playercharacters.activeKey)"
                    v-if="!selecting && !!$rsd.playercharacters.active"
                >
                    <v-list-item-icon class="mr-2">
                        <v-btn
                            icon 
                            class="white--text icon-offset"
                            elevation="5"
                            small
                            :style="GameIcons.get.color($rsd.playercharacters.active.color)"
                        >
                            <span 
                                v-if="!!$rsd.playercharacters.active.icon" 
                                class="gi-icon white"
                                :style="GameIcons.get.style($rsd.playercharacters.active.icon)"    
                            ></span>
                            <v-icon v-else>mdi-ship-wheel</v-icon>
                        </v-btn>
                    </v-list-item-icon>
                    <v-list-item-title>{{$rsd.playercharacters.active.name}}</v-list-item-title>
                    <v-list-item-icon>
                        <v-icon>mdi-chevron-down</v-icon>
                    </v-list-item-icon>
                </v-list-item>
                <v-list-item 
                    link 
                    class="pl-2 pr-4 py-1" 
                    @click="toggleSelection(false)" 
                    @contextmenu="characters.contextmenu($event)"
                    v-show="!!selecting"
                >
                    <v-list-item-icon class="mr-1">
                        <v-icon>mdi-notebook-edit</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Characters</v-list-item-title>
                    <v-list-item-icon>
                        <v-icon>mdi-chevron-up</v-icon>
                    </v-list-item-icon>
                </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-slide-y-transition hide-on-leave>
                <div class="flex-row fill-height" :class="!!selecting ? 'd-flex' : ''" v-show="!!selecting">
                    <v-list
                        dense
                        class="d-flex flex-grow-1 py-0 flex-column right-border alt-scrollbar content-list"
                        :style="`width:${playercharacters.width()}px`"
                    >
                        <draggable 
                            v-model='playerCharacterArray'
                            v-bind="dragOptions"
                            @start="playerDrag = true"
                            @end="playerDrag = false"
                        >
                            <transition-group type="transition" :name="!playerDrag ? 'flip-list' : null">
                                <v-list-item
                                    v-for="(playercharacter, index) in playerCharacterArray"
                                    :key="'party-'+index"
                                    link 
                                    class="pl-2 pr-4 py-1 no-flex"
                                    @click="playercharacters.selectPlayerCharacter(playercharacter, index)"
                                    @contextmenu="playercharacters.contextmenu($event, playercharacter, playercharacter._key)"
                                >
                                    <v-list-item-icon class="mr-2">
                                        <v-btn
                                            icon 
                                            class="white--text icon-offset"
                                            elevation="5"
                                            small
                                            :class="!!$rsd.playercharacters.activeKey && $rsd.playercharacters.activeKey == playercharacter._key ? (!!playercharacter.color ? '' : 'primary') : 'grey'"
                                            :style="!!playercharacter.color ? GameIcons.get.color(playercharacter.color) : ''"
                                        >
                                            <span 
                                                v-if="!!playercharacter.icon" 
                                                class="gi-icon white"
                                                :style="GameIcons.get.style(playercharacter.icon)"    
                                            ></span>
                                            <v-icon v-else>mdi-ship-wheel</v-icon>
                                        </v-btn>
                                    </v-list-item-icon>
                                    <v-list-item-title>{{playercharacter.name}}</v-list-item-title>
                                </v-list-item>
                            </transition-group>
                        </draggable>
                        <!-- <v-list-item link class="pl-2 pr-4 py-1 no-flex" @click="openAddCampaignDialog">
                            <v-list-item-icon class="mr-2">
                                <v-btn
                                    icon 
                                    class="white--text icon-offset grey lighten-2"
                                    elevation="5"
                                    small
                                >
                                    <v-icon>mdi-notebook-plus</v-icon>
                                </v-btn>
                            </v-list-item-icon>
                            <v-list-item-title>Add campaign</v-list-item-title>
                        </v-list-item> -->
                    </v-list>
                </div>
            </v-slide-y-transition>
            <div class="flex-row fill-height" :class="!selecting ? 'd-flex' : ''" v-show="!selecting">
                <transition type="transition" name="quick-fade" @after-leave="onBuilderTransitionAfterLeave">
                    <v-list
                        dense
                        class="d-flex flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                        v-show="!!showBuilder"
                        :style="`width:${builder.width}px; ${!!showBuilder ? '' : 'opacity: 0;'}'`"
                    >
                        <v-list-item
                            link 
                            class="pl-2 pr-4 py-1 no-flex"
                            @click="builder.selectOverview()"
                        >
                            <v-list-item-icon class="mr-2">
                                <v-btn
                                    icon
                                    class="white--text icon-offset"
                                    :class="!!rsd.gamestate.menu.builder.overview ? 'primary' : 'grey'"
                                    elevation="5"
                                    small
                                >
                                    <v-icon>mdi-format-list-bulleted</v-icon>
                                </v-btn>
                            </v-list-item-icon>
                            <v-list-item-title>Overview</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                            link 
                            class="pl-2 pr-4 py-1 no-flex"
                            @click="builder.selectBuilder()"
                        >
                            <v-list-item-icon class="mr-2">
                                <v-btn
                                    icon
                                    class="white--text icon-offset"
                                    :class="!!rsd.gamestate.menu.builder.builder ? 'primary' : 'grey'"
                                    elevation="5"
                                    small
                                >
                                    <v-icon>mdi-toy-brick-plus</v-icon>
                                </v-btn>
                            </v-list-item-icon>
                            <v-list-item-title>Character Build</v-list-item-title>
                        </v-list-item>

                        <v-list-item
                            link 
                            class="pl-2 pr-4 py-1 no-flex"
                            @click="builder.selectInventory()"
                        >
                            <v-list-item-icon class="mr-2">
                                <v-btn
                                    icon
                                    class="white--text icon-offset"
                                    :class="!!rsd.gamestate.menu.builder.inventory ? 'primary' : 'grey'"
                                    elevation="5"
                                    small
                                >
                                    <span
                                        class="gi-icon white"
                                        :style="GameIcons.get.style('knapsack')"    
                                    ></span>
                                </v-btn>
                            </v-list-item-icon>
                            <v-list-item-title>Inventory</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </transition>
                <div 
                    class="d-flex fill-height right-border"
                ></div>
                <transition type="transition" name="quick-fade" @after-leave="onBlocksTransitionAfterLeave">
                    <v-list
                        dense
                        v-if="!!rsd.gamestate.menu.builder.overview"
                        class="flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                        :class="!!rsd.gamestate.menu.builder.overview ? 'd-flex' : ''"
                        :style="`width:${blocks.width}px; ${!!showBlocks ? '' : 'opacity: 0;'}'`"
                        v-show="!!showBlocks"
                    >
                        <v-list-item
                            class="pl-2 pr-4 py-1 no-flex accent-item list-header"
                            :class="gameView.overview == 'status' ? 'accent-selected' : ''"
                            @click="overview.selectPage('status')"
                            @contextmenu="current.contextmenu($event)"
                        >
                            <v-list-item-content class="py-0">
                                <v-list-item-title>
                                    <span>Character overview</span>
                                </v-list-item-title>
                                <v-list-item-subtitle class="d-flex">
                                    <span class="mr-2"></span>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                            class="pl-2 pr-4 py-1 no-flex accent-item list-header"
                            :class="gameView.overview == 'party' ? 'accent-selected' : ''"
                            :disabled="overview.partyDisabled()"
                            @click="overview.selectPage('party')"
                        >
                            <v-list-item-content class="py-0">
                                <v-list-item-title>
                                    <span>Party overview</span>
                                </v-list-item-title>
                                <v-list-item-subtitle class="d-flex">
                                    <span class="mr-2"></span>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                            class="pl-2 pr-4 py-1 no-flex accent-item list-header"
                            :class="gameView.overview == 'skills' ? 'accent-selected' : ''"
                            @click="overview.selectPage('skills')"
                        >
                            <v-list-item-content class="py-0">
                                <v-list-item-title>
                                    <span>Skills overview</span>
                                </v-list-item-title>
                                <v-list-item-subtitle class="d-flex">
                                    <span class="mr-2"></span>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                            class="pl-2 pr-4 py-1 no-flex accent-item list-header"
                            :class="gameView.overview == 'feats' ? 'accent-selected' : ''"
                            @click="overview.selectPage('feats')"
                        >
                            <v-list-item-content class="py-0">
                                <v-list-item-title>
                                    <span>Feats overview</span>
                                </v-list-item-title>
                                <v-list-item-subtitle class="d-flex">
                                    <span class="mr-2"></span>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                            class="pl-2 pr-4 py-1 no-flex accent-item list-header"
                            :class="gameView.overview == 'actions' ? 'accent-selected' : ''"
                            @click="overview.selectPage('actions')"
                        >
                            <v-list-item-content class="py-0">
                                <v-list-item-title>
                                    <span>Actions overview</span>
                                </v-list-item-title>
                                <v-list-item-subtitle class="d-flex">
                                    <span class="mr-2"></span>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-list
                        dense
                        v-if="!!rsd.gamestate.menu.builder.builder"
                        class="flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                        :class="!!rsd.gamestate.menu.builder.builder ? 'd-flex' : ''"
                        :style="`width:${blocks.width}px; ${!!showBlocks ? '' : 'opacity: 0;'}'`"
                        v-show="!!showBlocks"
                    >
                        <v-list-item
                            class="pl-2 pr-4 py-1 no-flex accent-item list-header"
                            :class="gameView.build == 0 ? 'accent-selected' : ''"
                            @click="build.selectLevel(0)"
                        >
                            <v-list-item-content class="py-0">
                                <v-list-item-title>
                                    <span>Base setup</span>
                                </v-list-item-title>
                                <v-list-item-subtitle class="d-flex">
                                    <span class="mr-2"></span>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                            v-if="!!$rsd.playercharacters.active.adv"
                            v-for="(level, index) in levels"
                            :key="'level-'+index"
                            @click="build.selectLevel(level)"
                            class="pl-2 pr-4 py-1 no-flex accent-item list-header"
                            :class="build.levelClass(level)"
                        >
                            <v-list-item-content class="py-0">
                                <v-list-item-title>
                                    <span>Level {{ level }}</span>
                                </v-list-item-title>
                                <v-list-item-subtitle class="d-flex">
                                    <span class="mr-2"></span>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-list
                        dense
                        v-if="!!rsd.gamestate.menu.builder.inventory"
                        class="flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                        :class="!!rsd.gamestate.menu.builder.inventory ? 'd-flex' : ''"
                        :style="`width:${blocks.width}px; ${!!showBlocks ? '' : 'opacity: 0;'}'`"
                        v-show="!!showBlocks"
                    >
                    </v-list>
                </transition>
                <div 
                    class="d-flex fill-height right-border"
                ></div>
            </div>
        </div>

        <FloatingMenu ref="playerCharacterContextMenu" :menu="playerCharacterContextMenu" />
        <FloatingMenu ref="generalCharacterContextMenu" :menu="generalCharacterContextMenu" />
        <CharacterContextMenu ref="characterContextMenu" />

        <ConfirmDialog ref="removePlayerCharacterDialog" @Agree="$rsd.playercharacters.removePC(playercharacters.contextSelected._key)"/>

    </div>
</template>

<script>
import draggable from 'vuedraggable'

import ConditionIndicator from '@root/.shared/components/ConditionIndicator'
import ConfirmDialog from '@root/.shared/components/ConfirmDialog'
import FloatingMenu from '@root/.shared/components/FloatingMenu'

import CharacterContextMenu from './components/CharacterContextMenu.vue'

export default {
    props: {
        menu: Object,
    },
    components: {
        CharacterContextMenu,
        ConditionIndicator,
        ConfirmDialog,
        draggable,
        FloatingMenu,
    },
    data() {
        return {
            levels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],

            selecting: false,

            playerDrag: false,
            showBuilder: false,
            showBlocks: false,

            characters: {
                contextmenu: (event) => {
                    event.preventDefault()

                    this.closeContextMenus()

                    const clickX = event.clientX
                    const clickY = event.clientY
    
                    this.getDialog('generalCharacterContextMenu').show(clickX, clickY, {width: 200});
                },
            },

            playercharacters: {
                width: () => {
                    return this.builder.width + this.blocks.width + 2
                },
                selectPlayerCharacter: (playercharacter, id) => {
                    if (!!playercharacter._key && this.$rsd.playercharacters.activeKey != playercharacter._key) {
                        this.showBuilder = false
                        this.showBlocks = false
                        this.$rsd.playercharacters.activeKey = playercharacter._key
                    }
                    this.toggleSelection(false)
                },
                contextSelected: null,
                contextmenu: (event, playercharacter, index) => {
                    event.preventDefault()

                    this.closeContextMenus()

                    this.playercharacters.contextSelected = {...playercharacter, _key: index}

                    const clickX = event.clientX
                    const clickY = event.clientY
    
                    this.getDialog('playerCharacterContextMenu').show(clickX, clickY, {width: 200});
                },
            },

            builder: {
                width: 200,
                prevWidth: 200,
                startX: null,
                selectOverview: () => {
                    if (!this.$store.getters['rsd/gamestate'].menu.builder.overview) {
                        this.showBlocks = false
                        setTimeout(() => {
                            this.$store.dispatch('rsd/setBuilderState', 'overview')
                        }, 75)
                    }
                },
                selectBuilder: () => {
                    if (!this.$store.getters['rsd/gamestate'].menu.builder.builder) {
                        this.showBlocks = false
                        setTimeout(() => {
                            this.$store.dispatch('rsd/setBuilderState', 'builder')
                        }, 75)
                    }
                },
                selectInventory: () => {
                    if (!this.$store.getters['rsd/gamestate'].menu.builder.inventory) {
                        this.showBlocks = false
                        setTimeout(() => {
                            this.$store.dispatch('rsd/setBuilderState', 'inventory')
                        }, 75)
                    }
                },
            },

            overview: {
                selectPage: (page) => {
                    this.$store.dispatch('rsd/setGameView', {
                        ...this.gameView,
                        overview: page,
                    })
                },
                partyDisabled: () => {
                    return !(!!this.$rsd.playercharacters.active && !!this.$rsd.playercharacters.active.partyid && !!this.$rsd.playercharacters.active.gmid && this.$rsd.playercharacters.active.partyid != 'localcharacter')
                }
            },

            build: {
                selectLevel: (level) => {
                    this.$store.dispatch('rsd/setGameView', {
                        ...this.gameView,
                        build: level,
                    })
                    this.$store.dispatch('rsd/resetBuildViewOpen')
                },
                levelClass: (level) => {
                    let classList = ''
                    if (this.gameView.build == level) {
                        classList += 'accent-selected'
                    }
                    if (this.$rsd.playercharacters.active.level < level) {
                        classList += ' list_odd'
                    }
                    
                    
                    return classList
                },
            },

            blocks: {
                width: 250,
            },

            current: {
                contextmenu: (event, playercharacter, index) => {
                    event.preventDefault()

                    this.closeContextMenus()

                    const clickX = event.clientX
                    const clickY = event.clientY
    
                    // this.getDialog('currentContextMenu').show(clickX, clickY, {width: 200});

                    this.playercharacters.contextSelected = {...this.$rsd.playercharacters.active, _key: this.$rsd.playercharacters.activeKey}

                    this.getDialog('characterContextMenu').show(clickX, clickY, {width: 225, selected: this.playercharacters.contextSelected});
                },
                dragOldIndex: -1,
                dragStart(event) {
                    // this.currentMembersDrag = true
                    // this.dragOldIndex = event.oldIndex
                },
                dragEnd(event) {
                    // this.currentMembersDrag = false
                }
            },

            playerCharacterContextMenu: {
                items: [
                    {
                        title: 'Rename Character',
                        icon: 'mdi-form-textbox',
                        func: () => {
                            this.openEditPlayerCharacterDialog()
                        }
                    },
                    {
                        title: 'Change Icon & Color',
                        icon: 'mdi-palette',
                        func: () => {
                            this.openEditPlayerCharacterStyleDialog()
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        title: 'New Character',
                        icon: 'mdi-account-plus',
                        func: () => {
                            this.openAddPlayerCharacterDialog()
                        }
                    },
                    {
                        title: 'Delete Character',
                        icon: 'mdi-account-remove',
                        danger: true,
                        func: () => {
                            if (!!this.playercharacters.contextSelected && !!this.playercharacters.contextSelected._key) {
                                this.toggleSelection(true)

                                this.$rsd.dialog.open({
                                    name: "confirmDialog",
                                    attrs: [
                                        "Remove character",
                                        `Are you sure you want to remove the character ${this.playercharacters.contextSelected.name}?`,
                                        () => {
                                            this.$rsd.playercharacters.removePC(this.playercharacters.contextSelected._key)
                                        },
                                    ],
                                });
                            }
                        }
                    }
                ]
            },

            generalCharacterContextMenu: {
                items: [
                    {
                        title: 'New Character',
                        icon: 'mdi-account-plus',
                        func: () => {
                            this.openAddPlayerCharacterDialog()
                        }
                    },
                ]
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
                this.showBuilder = true
            }, 75)
        },
        onBlocksTransitionAfterLeave() {
            setTimeout(() => {
                this.showBlocks = true
            }, 75)
        },

        closeContextMenus() {
            this.getDialog('playerCharacterContextMenu').close()
            this.getDialog('generalCharacterContextMenu').close()
            this.getDialog('characterContextMenu').close()
        },

        openAddPlayerCharacterDialog() {
            this.toggleSelection(false)
            this.$rsd.dialog.open({name: 'playerCharacterDialog', attrs: [false, {}]})
        },
        openEditPlayerCharacterDialog() {
            this.$rsd.dialog.open({name: 'playerCharacterDialog', attrs: [true, {...this.playercharacters.contextSelected}]})
        },
        openEditPlayerCharacterStyleDialog() {
            this.$rsd.dialog.open({name: 'playerCharacterStyleDialog', attrs: [true, {...this.playercharacters.contextSelected}]})
        },
    },
    created() {
    },
    destroyed() {
    },
    mounted() {
        setTimeout(() => {
            this.showBuilder = true
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
    height: calc(~"100vh - 128px");
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