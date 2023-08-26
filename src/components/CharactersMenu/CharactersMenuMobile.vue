<template>
    <div class="flex-grow-1 width-100">
        <v-slide-x-reverse-transition>
            <div 
                class="flex-grow-1 width-100" 
                :class="!(characterSelected || submenuSelected || overviewSelected || buildSelected) ? 'd-flex' : 'd-none'" v-show="!(characterSelected || submenuSelected || overviewSelected || buildSelected)"
            >
                <v-list
                    dense
                    class="flex-grow-1 flex-column"
                >
                    <draggable 
                        v-model='playerCharacterArray'
                        v-bind="dragOptions"
                        handle=".handle"
                        @start="playerDrag = true"
                        @end="playerDrag = false"
                    >
                        <transition-group type="transition" :name="!playerDrag ? 'flip-list' : null">
                            <v-list-item
                                v-for="(playercharacter, index) in playerCharacterArray"
                                :key="'party-'+index"
                                link
                                class="pl-2 pr-4 py-1 no-flex"
                                @click="navigation.playercharacters.click(playercharacter, index)"
                                :ripple="false"
                            >
                                <v-list-item-icon class="mr-2">
                                    <v-btn
                                        icon 
                                        class="white--text icon-offset"
                                        elevation="5"
                                        small
                                        :class="(!!playercharacter.color ? '' : 'primary')"
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
                                <v-list-item-content class="py-0">
                                    <v-list-item-title>{{playercharacter.name}}</v-list-item-title>
                                </v-list-item-content>
                                <fade-x-width-transition>
                                    <v-list-item-icon
                                        v-show="!!mobileView.sortMode"
                                        class="handle"
                                        @click.stop=""
                                        @mousedown.stop=""
                                        @touchstart.stop=""
                                    >
                                        <v-icon>mdi-reorder-horizontal</v-icon>
                                    </v-list-item-icon>
                                </fade-x-width-transition>
                            </v-list-item>
                        </transition-group>
                    </draggable>
                </v-list>
            </div>
        </v-slide-x-reverse-transition>
        <v-slide-x-reverse-transition>
            <div class="flex-grow-1 width-100" :class="!!characterSelected && !submenuSelected ? 'd-flex' : 'd-none'" v-show="!!characterSelected && !submenuSelected">
                <v-list
                    dense
                    class="flex-grow-1 flex-column"
                >
                    <v-list-item
                        link 
                        class="pl-2 pr-4 py-1 no-flex"
                        @click="navigation.builder.selectOverview()"
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
                        @click="navigation.builder.selectBuilder()"
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
                        @click="navigation.builder.selectInventory()"
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
            </div>
        </v-slide-x-reverse-transition>
        <v-slide-x-reverse-transition>
            <div class="flex-grow-1 width-100" :class="!!submenuSelected ? 'd-flex' : 'd-none'" v-show="!!submenuSelected">
                <v-list
                    dense
                    v-if="!!rsd.gamestate.menu.builder.overview"
                    class="flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                    :class="!!rsd.gamestate.menu.builder.overview ? 'd-flex' : ''"
                    v-show="!!showBlocks"
                >
                    <v-list-item
                        class="pl-2 pr-4 py-1 no-flex accent-item list-header"
                        :class="gameView.overview == 'status' ? 'accent-selected' : ''"
                        @click="navigation.overview.selectPage('status')"
                    >
                        <v-list-item-content class="py-0">
                            <v-list-item-title>
                                <span>Current status</span>
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
                        @click="navigation.overview.selectPage('party')"
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
                        @click="navigation.overview.selectPage('skills')"
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
                        @click="navigation.overview.selectPage('feats')"
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
                        @click="navigation.overview.selectPage('actions')"
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
                    v-show="!!showBlocks"
                >
                    <v-list-item
                        class="pl-2 pr-4 py-1 no-flex accent-item list-header"
                        :class="gameView.build == 0 ? 'accent-selected' : ''"
                        @click="navigation.build.selectLevel(0)"
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
                        @click="navigation.build.selectLevel(level)"
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
                    v-show="!!showBlocks"
                >
                </v-list>
            </div>
        </v-slide-x-reverse-transition>
    </div>
</template>

<script>
import draggable from 'vuedraggable'

import ConditionIndicator from '@root/.shared/components/ConditionIndicator'

// import EncounterMenuMobile from '@/components/EncounterMenu/EncounterMenuMobile'

export default {
    components: {
        draggable,

        ConditionIndicator,
        // EncounterMenuMobile,
    },
    data() {
        return {
            levels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
            
            playerDrag: false,
            encounterDrag: false,
            showBuilder: false,
            showBlocks: false,

            navigation: {
                builder: {
                    selectOverview: () => {
                        this.builder.selectOverview()
                        this.navigation.selectSubmenu()
                    },
                    selectBuilder: () => {
                        this.builder.selectBuilder()
                        this.navigation.selectSubmenu()
                    },
                    selectInventory: () => {
                        this.builder.selectInventory()
                        this.navigation.selectSubmenu()
                    },
                },
                overview: {
                    selectPage: (page) => {
                        this.overview.selectPage(page)
                        this.navigation.selectOverview()
                    },
                },
                build: {
                    selectLevel: (level) => {
                        this.build.selectLevel(level)
                        this.navigation.selectBuild()
                    },
                },
                selectSubmenu: () => {
                    this.$emit('click')
                    setTimeout(() => {
                        this.$store.dispatch('rsd/setMobileView', {
                            ...this.mobileView,
                            characterSelected: true,
                            submenuSelected: true,
                            overviewSelected: false,
                            buildSelected: false,
                        })
                    }, 100)
                },
                selectOverview: () => {
                    this.$emit('click')
                    setTimeout(() => {
                        this.$store.dispatch('rsd/setMobileView', {
                            ...this.mobileView,
                            characterSelected: true,
                            submenuSelected: true,
                            overviewSelected: true,
                            buildSelected: false,
                        })
                    }, 100)
                },
                selectBuild: () => {
                    this.$emit('click')
                    setTimeout(() => {
                        this.$store.dispatch('rsd/setMobileView', {
                            ...this.mobileView,
                            characterSelected: true,
                            submenuSelected: true,
                            overviewSelected: false,
                            buildSelected: true,
                        })
                    }, 100)
                },
                click: (name) => {
                    if (!!name) {
                        this.$store.dispatch('rsd/setMobileView', {
                            ...this.mobileView,
                            editMode: false,
                            navigation: name
                        })

                        this.$store.dispatch('rsd/setGamePage', name)
                    }
                },
                current: (name) => {
                    if (name == 'playercharacters') {
                        return !this.mobileView.navigation || this.mobileView.navigation == name
                    } else {
                        return !!this.mobileView.navigation && this.mobileView.navigation == name
                    }
                },
                playercharacters: {
                    click: (playercharacter, index) => {
                        if (!this.mobileView.sortMode) {                      
                            this.playercharacters.selectplayercharacter(playercharacter)

                            this.$route.meta.customTitle = playercharacter.name

                            setTimeout(() => {
                                this.$store.dispatch('rsd/setMobileView', {
                                    ...this.mobileView,
                                    characterSelected: true,
                                    submenuSelected: false,
                                })
                            }, 100)
                        }
                    }
                },
                encounters: {
                    selectCombat: () => {
                        this.encounters.selectCombat()

                        setTimeout(() => {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                characterSelected: true,
                                submenuSelected: true,
                            })
                        }, 100)
                    },
                    selectEncounter: (encounter, index) => {
                        if (!this.mobileView.sortMode) {
                            this.encounters.selectEncounter(encounter)

                            setTimeout(() => {
                                this.$store.dispatch('rsd/setMobileView', {
                                    ...this.mobileView,
                                    characterSelected: true,
                                    submenuSelected: true,
                                })
                            }, 100)
                        }
                    }
                },
            },


            builder: {
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

            playercharacters: {
                selectplayercharacter: (playercharacter) => {
                    if (!!playercharacter._key && this.playercharacterActiveKey != playercharacter._key) {
                        this.$rsd.playercharacters.activeKey = playercharacter._key

                        setTimeout(() => {
                            this.$store.dispatch('rsd/setGamePage', 'playercharacter')
                        }, 50)
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
        playerCharacterArray: {
            get() {
                return this.$store.getters['remotedb/playerCharacterArray']
            },
            set(value) {
                this.$rsd.playercharacters.setArray(value)
            }
        },
        
        characterSelected() {
            return !!this.navigation.current('Characters') && !!this.mobileView.characterSelected && !this.mobileView.submenuSelected && !this.mobileView.overviewSelected
        },
        submenuSelected() {          
            return !!this.navigation.current('Characters') && !!this.mobileView.characterSelected && !!this.mobileView.submenuSelected && !this.mobileView.overviewSelected
        },
        overviewSelected() {          
            return !!this.navigation.current('Characters') && !!this.mobileView.characterSelected && !!this.mobileView.submenuSelected && !!this.mobileView.overviewSelected
        },
        buildSelected() {
            return !!this.navigation.current('Characters') && !!this.mobileView.characterSelected && !!this.mobileView.submenuSelected && !!this.mobileView.buildSelected 
        },
    },
    methods: {
        getObject(combatant, modifier = 0) {
            if (combatant.type == 'npc' || combatant.type == 'hazard') {
                return !!combatant.bid ? this.$rsd.bestiary.getObject(combatant.bid, modifier) : null
            } else {
                return !!combatant ? this.$rsd.members.getObject(combatant) : null
            }
        },

        /* Dialogs */

    },
}
</script>

<style lang="less" scoped>
.no-flex {
    flex: none;
}

.button-footer {
    position: fixed;
    bottom: 0px;
}

.content-list {
    height: calc(~"100vh - 144px");
    overflow-y: auto;
}

.fade-x-width-transition {
    &-leave-active {
        transition: all .2s ease;
    }
    
    &-enter-active {
        transition: all .3s ease;
    }

    &-enter, &-leave-to {
        opacity: 0;
        width: 1px;
    }
}

.show-checkbox {
    width: 32px;
    opacity: 1;
}

.hide-checkbox {
    width: 0px;
    opacity: 0;
}
</style>