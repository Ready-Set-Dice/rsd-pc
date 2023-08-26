<template>
    <v-container
        fill-height
        fluid
        class="ma-0 pa-0 align-start d-flex flex-grow-1 flex-column"
    >
        <v-app-bar
            height="32"
            style="width: 100%; max-height:32px"
            class="navblend"
            :class="!!rsd.darkmode ? '' : 'darken-1'"
            elevation="2"
            :style="'top:-32px;'"
            app
            absolute
        >
            <div class="d-flex justify-start align-center" :style="'width: 100%;'">
                <div :style="'position: absolute; left: 0;'">
                    <v-btn icon small tile class="primary--text" 
                        @click="menu.back()"
                        v-show="!!hasBackButton"
                    >
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                </div>
            </div>
            <MobileSpeedDial />

        </v-app-bar>
        <div class="flex-grow-1 width-100" :class="mobileView.navigation == 'Characters' ? 'd-flex' : 'd-none'" v-show="mobileView.navigation == 'Characters'">
            <CharactersMenuMobile v-show="!overviewSelected && !buildSelected" />

            <CombatantSheet
                :visible="!!overviewSelected && !!rsd.gamestate.menu.builder.overview && gameView.overview == 'status'"
                :localCharacter="characterObject"
                :containerClass="'mobile-view'"
                :index="!!characterObject && (!!characterObject._key || characterObject._key == 0) ? characterObject._key : null"
                :nonCombat="true"
                :instance="characterObject"
            />
            <PartyViewMobile v-show="!!overviewSelected && !!rsd.gamestate.menu.builder.overview && gameView.overview == 'party'" :localCharacter="characterObject" />
            <BuildViewMobile v-show="!!buildSelected && !!rsd.gamestate.menu.builder.builder" />
            <FeatsViewMobile v-show="!!overviewSelected && !!rsd.gamestate.menu.builder.overview && gameView.overview == 'feats'" :localCharacter="characterObject" />
            
        </div>
        <!-- Combat View -->
        <v-slide-x-reverse-transition>
            <div class="flex-grow-1 width-100" :class="mobileView.navigation == 'Combat' ? 'd-flex' : 'd-none'" v-show="mobileView.navigation == 'Combat'">
                <!-- <PartyMenuMobile v-show="!mobileView.combatSelected" />
                <PartyViewMobile v-show="!!mobileView.combatSelected" /> -->
                <CombatMenuMobile :localCharacter="characterObject" v-show="!mobileView.combatantSelected" />
                <CombatantSheet
                    :visible="!!mobileView.combatantSelected"
                    :restricted="!!tindex && tindex.type == 'npc'"
                    :containerClass="'mobile-view'"
                    :localCharacter="characterObject"
                    :index="!!tindex && (!!tindex._key || tindex._key == 0) ? tindex._key : null"
                    :instanceArray="'combatantsArray'"
                />
            </div>
        </v-slide-x-reverse-transition>
        <!-- Search View -->
        <v-slide-x-reverse-transition>
            <div class="flex-grow-1 width-100" :class="mobileView.navigation == 'Search' ? 'd-flex' : 'd-none'" v-show="mobileView.navigation == 'Search'">
                <SearchMenuMobile v-show="!mobileView.searchSelected" />
                <div class="fill-height flex-grow-1 width-100" v-show="!!mobileView.searchSelected">
                    <SpellSheet
                        :spell="!!rsd && !!rsd.gamestate && !!rsd.gamestate.view && !!rsd.gamestate.view.search 
                        && !!rsd.gamestate.view.search.selected ? rsd.gamestate.view.search.selected : null"
                        :visible="!!rsd.gamestate.view.search.type && rsd.gamestate.view.search.type == 'Spells'"
                        :containerClass="'mobile-view'"
                    />
                    <!-- <span>{{rsd.gamestate.view.search.selected}}</span> -->
                </div>
            </div>
        </v-slide-x-reverse-transition>
        <!-- Settings View -->
        <!-- <v-slide-x-reverse-transition>
            <div class="flex-grow-1 width-100" :class="mobileView.navigation == 'Settings' ? 'd-flex' : 'd-none'" v-show="mobileView.navigation == 'Settings'">
                <SettingsMenuMobile v-show="!mobileView.settingDetailsSelected" />
                <SettingsView v-show="!!mobileView.settingDetailsSelected" />
            </div>
        </v-slide-x-reverse-transition> -->
        <div
            class="d-flex width-100 button-footer flex-column"
        >
            <div class="d-flex flex-row">            
                <template v-for="(submenu, index) in menu.submenus">
                    <div class="d-flex flex-grow-1" :key="'hoofdmenu-'+index" :style="'flex-basis: 0;'">
                        <v-btn 
                            tile 
                            class="d-flex flex-grow-1"
                            :class="mobileView.navigation == submenu.name ? 'primary--text' : 'grey--text'"
                            :disabled="!mobileView.characterSelected && submenu.name == 'Combat'"
                            height="64" 
                            @click="navigation.click(submenu.name)"
                        >
                            <div class="d-flex flex-column">
                                <v-icon>{{submenu.icon}}</v-icon>
                                <span class="text-caption">{{submenu.name}}</span>
                            </div>
                        </v-btn>
                    </div>
                </template>
            </div>
        </div>
    </v-container>
</template>

<script>
import BuildViewMobile from '@/components/BuildView/BuildViewMobile'
import CharactersMenuMobile from '@/components/CharactersMenu/CharactersMenuMobile'
import CombatMenuMobile from '@/components/CombatMenu/CombatMenuMobile'
import FeatsViewMobile from '@/components/FeatsView/FeatsViewMobile'
import PartyViewMobile from '@root/.shared/components/PartyView/PartyViewMobile'
import SearchMenuMobile from '@/components/SearchMenu/SearchMenuMobile'

import MobileSpeedDial from '@/components/MobileSpeedDial/MobileSpeedDial'

import BestiarySheet from '@root/.shared/components/CombatantSheet/BestiarySheet'
import CombatantSheet from '@root/.shared/components/CombatantSheet/CombatantSheet'
import SpellSheet from '@root/.shared/components/SpellSheet/SpellSheet'

export default {
    components: {
        BuildViewMobile,
        CharactersMenuMobile,
        CombatMenuMobile,
        FeatsViewMobile,
        PartyViewMobile,
        SearchMenuMobile,

        MobileSpeedDial,

        BestiarySheet,
        CombatantSheet,
        SpellSheet,
    },
    data() {
        return {
            campaignDrag: false,
            encounterDrag: false,
            combatDialog: false,

            showArray: false,

            dyingQueue: [],

            strengthTypes: [
                {title: 'elite'},
                {title: 'normal'},
                {title: 'weak'},
            ],

            combatAddTypes: [
                {title: 'party'},
                {title: 'combatant'},
            ],
            
            menu: {
                selected: (name) => {
                    return this.rsd.gamestate.current == name
                },
                submenus: [
                    {name: 'Characters', icon: 'mdi-view-dashboard'},
                    {name: 'Combat', icon: 'mdi-account-group'},
                    {name: 'Search', icon: 'mdi-magnify'},
                ],
                select: (name) => {
                    if (name == 'Home') {
                        window.location.href = "https://readysetdice.com";
                    } else if (name == 'Player') {
                        window.location.href = "https://pc.readysetdice.com";
                    } else {
                        this.$route.meta.customTitle = name

                        if (this.rsd.gamestate.current != name) {
                            this.$store.dispatch('rsd/setGamePage', name)
                        } else {
                            this.$store.dispatch('rsd/setGamePage', null)
                        }
                    }
                },

                back: () => {
                    this.$store.dispatch('rsd/setMobileView', {
                        ...this.mobileView,
                        sortMode: false
                    })

                    if (this.mobileView.navigation == 'Characters') {
                        if (!!this.mobileView.overviewSelected || !!this.mobileView.buildSelected) {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                characterSelected: true,
                                submenuSelected: true,
                                overviewSelected: false,
                                buildSelected: false,
                            })    
                        } else if (!!this.mobileView.submenuSelected) {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                characterSelected: true,
                                submenuSelected: false,
                                overviewSelected: false,
                            })
                        } else if (!!this.mobileView.characterSelected) {
                            this.$route.meta.customTitle = 'PC Mobile Dashboard'

                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                characterSelected: false,
                                submenuSelected: false,
                                overviewSelected: false,
                            })
                        }
                    } else if (this.mobileView.navigation == 'Combat') {
                        if (!!this.mobileView.combatantSelected) {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                combatantSelected: false,
                            })
                        }
                    } else if (this.mobileView.navigation == 'Search') {
                        if (!!this.mobileView.searchSelected) {
                            this.$store.dispatch('rsd/setMobileView', {
                                ...this.mobileView,
                                searchSelected: false,
                            })
                        }
                    }
                },
            },

            navigation: {
                click: (name) => {
                    if (!!name) {
                        this.$store.dispatch('rsd/setMobileView', {
                            ...this.mobileView,
                            sortMode: false,
                            navigation: name
                        })

                        this.$store.dispatch('rsd/setGamePage', name)
                    }
                },
                current: (name) => {
                    if (name == 'Characters') {
                        return !this.mobileView.navigation || this.mobileView.navigation == name
                    } else {
                        return !!this.mobileView.navigation && this.mobileView.navigation == name
                    }
                },
            },
        }
    },
    computed: {
        characterSelected() {          
            return !!this.navigation.current('Characters') && !!this.mobileView.characterSelected && !this.mobileView.submenuSelected
        },
        submenuSelected() {          
            return !!this.navigation.current('Characters') && !!this.mobileView.characterSelected && !!this.mobileView.submenuSelected
        },
        overviewSelected() {          
            return !!this.navigation.current('Characters') && !!this.mobileView.characterSelected && !!this.mobileView.submenuSelected && !!this.mobileView.overviewSelected 
        },
        buildSelected() {
            return !!this.navigation.current('Characters') && !!this.mobileView.characterSelected && !!this.mobileView.submenuSelected && !!this.mobileView.buildSelected 
        },
        hasBackButton() {
            if (!!this.mobileView) {
                if (this.mobileView.navigation == 'Characters') {
                    return !!this.mobileView.characterSelected || !!this.mobileView.submenuSelected
                } else if (this.mobileView.navigation == 'Combat') {
                    return !!this.mobileView.combatantSelected
                } else if (this.mobileView.navigation == 'Search') {
                    return !!this.mobileView.searchSelected
                }
            }

            return false
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

        checkMDIIcon(icon) {
            return icon.includes('mdi-')
        },

        checkJoinParty() {
            if (!!window.location.hash) {
                this.processUrlQuery(window.location.hash)
            }
        },
        processUrlQuery(search) {
            const hrefsplit = search.split('?')
            if (hrefsplit && hrefsplit.length > 1) {
                const querysplit = hrefsplit[1].split('&')
                let gmid = null
                let partyid = null
                querysplit.forEach((e) => {
                    const varsplit = e.split('=')
                    if (varsplit[0] == 'gmid') {
                        gmid = varsplit[1]
                    } else if (varsplit[0] == 'partyid') {
                        partyid = varsplit[1]
                    }
                })

                console.log(gmid, partyid)

                if (gmid && partyid) {
                    let options = {
                        gmid: gmid,
                        partyid: partyid,
                        pcnames: this.$rsd.playercharacters.names
                    }

                    this.$rsd.dialog.open({name: 'partyJoinDialog', attrs: [true, options]})
                }

                // this.$router.replace('player-manager')
            }
        },
    },
    mounted() {
        if (!!this.mobileView.characterSelected) {
            this.$route.meta.customTitle = this.$rsd.playercharacters.active.name
        }
    },
    created() {
        setTimeout(() => {
            this.checkJoinParty()
        }, 100)
    },
    destroyed() {
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