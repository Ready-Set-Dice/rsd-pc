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
        >
            <div class="d-flex justify-start" :style="'width: 100%;'">
            </div>
        </v-app-bar>

        <!-- Main view -->
        <div class="d-flex flex-grow-1 flex-row width-100">
            <!-- Main menu -->
            <div
                class="navblend"
                style="
                height: 100%; 
                top: 0px; 
                width: 48px;
                border-right-color: rgba(0, 0, 0, 0.12) !important;
                border-right-style: solid;
                border-right-width: 1px;
                "
                :class="!!rsd.darkmode ? '' : 'darken-1'"
            >
                <template v-for="(submenu, index) in menu.submenus">
                    <v-list
                        :key="'submenu-'+index"
                        nav
                        dense
                        class="navblend pa-0 ma-0"
                        :class="!!rsd.darkmode ? '' : 'darken-1'"
                    >
                        <v-list-item 
                            v-for="item in submenu"
                            :key="item.name"
                            link
                            color="primary"
                            class="pa-auto ma-0 page-button"
                            :class="!!menu.selected(item.name) ? 'page-current' : ''"
                            :ripple="false"
                            style="height: 48px; width: 48px; border-radius:0px !important;"
                            @click="!menu.select(item.name)"
                            v-shortkey.once="['alt',item.shortkey]"
                            @shortkey="!!item.shortkey ? menu.select(item.name) : ''"
                        >
                            <v-tooltip right :open-delay="1000" content-class="no-transparancy">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-list-item-icon
                                        v-bind="attrs"
                                        v-on="on"
                                        class="pt-2" 
                                        :class="!!menu.selected(item.name) ? 'ml-0' : 'ml-1'"
                                    >
                                        <v-icon :class="menu.selected(item.name) ? 'primary--text' : ''">{{item.icon}}</v-icon>
                                    </v-list-item-icon>
                                </template>
                                <span>{{item.name}}</span>
                            </v-tooltip>
                        </v-list-item>
                    </v-list>
                    <v-divider v-if="index != 'switch'" :key="'divider-'+index"></v-divider>
                </template>
            </div>

            <!-- Menu's -->
            <CharactersMenu :menu="menu" v-show="!!rsd.gamestate.current && rsd.gamestate.current == 'Characters'" />
            <CombatMenu :menu="menu" v-show="!!rsd.gamestate.current && rsd.gamestate.current == 'Combat'" :localCharacter="characterObject" />
            <SearchMenu v-show="!!rsd.gamestate.current && rsd.gamestate.current == 'Search'" />
            <SettingsMenu v-show="!!rsd.gamestate.current && rsd.gamestate.current == 'Settings'" />
            <HelpMenu v-show="!!rsd.gamestate.current && rsd.gamestate.current == 'Help'" />

            <!-- Character overview view -->
            <div class="fill-height flex-grow-1 view-space" :class="views.characterOverview.class()" v-show="!!views.characterOverview.visible()" >
                <CombatantSheet
                    :visible="!!views.characterOverview.statusVisible()"
                    :containerClass="simpleContainerClass('Party')"
                    :localCharacter="characterObject"
                    :index="!!characterObject && (!!characterObject._key || characterObject._key == 0) ? characterObject._key : null"
                    :nonCombat="true"
                    :instance="characterObject"
                />
                <PartyView :visible="!!views.characterOverview.partyVisible()" :localCharacter="characterObject" />
                <FeatsView :visible="!!views.characterOverview.featsVisible()" :localCharacter="characterObject" />
            </div>

            <!-- Build view -->
            <div class="fill-height flex-grow-1 view-space" :class="views.characterBuild.class()" v-show="!!views.characterBuild.visible()" >
                <!-- <b>Work in progress</b> -->
                <BuildView />
            </div>

            <!-- Inventory view -->
            <div class="fill-height flex-grow-1" :class="views.characterInventory.class()" v-show="!!views.characterInventory.visible()" >
                <b>Work in progress</b>
            </div>

            <!-- Combat view -->
            <div class="fill-height flex-grow-1" :class="views.combat.class()" v-show="!!views.combat.visible()" >
                <CombatantSheet
                    :visible="true"
                    :restricted="!!tindex && tindex.type == 'npc'"
                    :containerClass="simpleContainerClass('Party')"
                    :localCharacter="characterObject"
                    :index="!!tindex && (!!tindex._key || tindex._key == 0) ? tindex._key : null"
                    :instanceArray="'combatantsArray'"
                />
            </div>

            <!-- Search view -->
            <div class="fill-height flex-grow-1" :class="views.search.class()" v-show="!!views.search.visible()" >
                <SpellSheet
                    :spell="!!rsd && !!rsd.gamestate && !!rsd.gamestate.view && !!rsd.gamestate.view.search 
                    && !!rsd.gamestate.view.search.selected ? rsd.gamestate.view.search.selected : null"
                    :visible="!!rsd.gamestate.view.search.type && rsd.gamestate.view.search.type == 'Spells'"
                    :containerClass="simpleContainerClass('Search')"
                />
                <div 
                    class="pa-2 alt-scrollbar build-sheet"
                    v-if="!!rsd && !!rsd.gamestate && !!rsd.gamestate.view && !!rsd.gamestate.view.search 
                    && !!rsd.gamestate.view.search.selected"
                    v-show="!!rsd.gamestate.view.search.type && (rsd.gamestate.view.search.type == 'Ancestries' || rsd.gamestate.view.search.type == 'Backgrounds' || rsd.gamestate.view.search.type == 'Classes')"
                >
                    <BaseSheetTitle :title="rsd.gamestate.view.search.selected.name" :type="rsd.gamestate.view.search.selected.type" />
                    <AncestrySheet :current="!!rsd.gamestate.view.search.type && rsd.gamestate.view.search.type == 'Ancestries' ? rsd.gamestate.view.search.selected : null" />
                    <BackgroundSheet :current="!!rsd.gamestate.view.search.type && rsd.gamestate.view.search.type == 'Backgrounds' ? rsd.gamestate.view.search.selected : null" />
                    <ClassSheet :current="!!rsd.gamestate.view.search.type && rsd.gamestate.view.search.type == 'Classes' ? rsd.gamestate.view.search.selected : null" />
                </div>
            </div>

            <!-- Help view -->
            <div class="fill-height flex-grow-1" :class="views.help.class()" v-show="!!views.help.visible()" >
                <HelpView />
            </div>

            <!-- Settings view -->
            <div class="fill-height flex-grow-1" :class="views.settings.class()" v-show="!!views.settings.visible()">
                <SettingsView />
            </div>

        </div>
    </v-container>
</template>

<script>

import CharactersMenu from '@/components/CharactersMenu/CharactersMenu'
import CombatMenu from '@/components/CombatMenu/CombatMenu'
import SearchMenu from '@/components/SearchMenu/SearchMenu'
import SettingsMenu from '@/components/SettingsMenu/SettingsMenu'
import HelpMenu from '@/components/HelpMenu/HelpMenu'

import PartyJoinDialog from '@/components/PartyJoinDialog'

import BaseSheetTitle from '@root/.shared/components/base/BaseSheetTitle'

import AncestrySheet from '@root/.shared/components/BuildSheet/AncestrySheet'
import BackgroundSheet from '@root/.shared/components/BuildSheet/BackgroundSheet'
import ClassSheet from '@root/.shared/components/BuildSheet/ClassSheet'
import BuildView from '@/components/BuildView/BuildView'
import CombatantSheet from '@root/.shared/components/CombatantSheet/CombatantSheet'
import FeatsView from '@/components/FeatsView/FeatsView'
import HelpView from '@/components/HelpView/HelpView'
import PartyView from '@root/.shared/components/PartyView/PartyView'
import SettingsView from '@/components/SettingsView/SettingsView'
import SpellSheet from '@root/.shared/components/SpellSheet/SpellSheet'

export default {
    components: {
        AncestrySheet,
        BackgroundSheet,
        BaseSheetTitle,
        BuildView,
        CharactersMenu,
        ClassSheet,
        CombatantSheet,
        CombatMenu,
        FeatsView,
        HelpMenu,
        HelpView,
        PartyJoinDialog,
        PartyView,
        SearchMenu,
        SettingsMenu,
        SettingsView,
        SpellSheet,
    },
    data() {
        return {
            menu: {
                selected: (name) => {
                    return this.rsd.gamestate.current == name
                },
                submenus: {
                    main: [
                        {name: 'Characters', icon: 'mdi-account-box-multiple', shortkey: 'c'},
                        {name: 'Combat', icon: 'mdi-sword-cross', shortkey: 'p'},
                        {name: 'Search', icon: 'mdi-magnify', shortkey: 's'},
                    ],
                    extra: [
                        {name: 'Settings', icon: 'mdi-cog'},
                        {name: 'Help', icon: 'mdi-help-circle'},
                    ],
                    switch: [
                        {name: 'Home', icon: 'mdi-home'},
                        {name: 'GM', icon: 'mdi-crown'},
                    ],
                },
                select: (name) => {
                    if (name == 'Home') {
                        window.location.href = "https://readysetdice.com";
                    } else if (name == 'GM') {
                        window.location.href = "https://gm.readysetdice.com";
                    } else {
                        this.$route.meta.customTitle = name

                        if (this.rsd.gamestate.current != name) {
                            this.$store.dispatch('rsd/setGamePage', name)
                        } else {
                            this.$store.dispatch('rsd/setGamePage', null)
                        }
                    }
                },
            },

            views: {
                full: (view) => {
                    return this.rsd.gamestate.current == null && this.rsd.gamestate.previous == view
                },
                characterOverview: {
                    visible: () => {
                        return (
                            !!this.rsd.gamestate.menu.builder.overview && (
                                this.rsd.gamestate.current == 'Characters' 
                                || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Characters')
                            )
                        )
                    },
                    statusVisible: () => {
                        return !!this.views.characterOverview.visible() && this.gameView.overview == 'status'
                    },
                    partyVisible: () => {
                        return !!this.views.characterOverview.visible() && this.gameView.overview == 'party'
                    },
                    featsVisible: () => {
                        return !!this.views.characterOverview.visible() && this.gameView.overview == 'feats'
                    },
                    class: () => {
                        if (this.views.characterOverview.visible()) {
                            return 'd-flex'
                        } else {
                            return 'd-none'
                        }
                    },
                    selecting: () => {
                        return this.rsd.gamestate.view.combat.selecting
                    }
                },
                characterBuild: {
                    visible: () => {
                        return (
                            !!this.rsd.gamestate.menu.builder.builder && (
                                this.rsd.gamestate.current == 'Characters' 
                                || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Characters')
                            )
                        )
                    },
                    class: () => {
                        if (this.views.characterBuild.visible()) {
                            return 'd-flex'
                        } else {
                            return 'd-none'
                        }
                    },
                },
                characterInventory: {
                    visible: () => {
                        return (
                            !!this.rsd.gamestate.menu.builder.inventory && (
                                this.rsd.gamestate.current == 'Characters' 
                                || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Characters')
                            )
                        )
                    },
                    class: () => {
                        if (this.views.characterInventory.visible()) {
                            return 'd-flex'
                        } else {
                            return 'd-none'
                        }
                    },
                },
                combat: {
                    visible: () => { return ((this.rsd.gamestate.current == 'Combat' || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Combat'))) },
                    class: () => { return !!this.views.combat.visible() ? 'd-flex' : 'd-none' }
                },
                help: {
                    visible: () => { return ((this.rsd.gamestate.current == 'Help' || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Help'))) },
                    class: () => { return !!this.views.help.visible() ? 'd-flex' : 'd-none' }
                },
                settings: {
                    visible: () => { return ((this.rsd.gamestate.current == 'Settings' || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Settings'))) },
                    class: () => { return !!this.views.settings.visible() ? 'd-flex' : 'd-none' }
                },
                search: {
                    visible: () => { return ((this.rsd.gamestate.current == 'Search' || (this.rsd.gamestate.current == null && this.rsd.gamestate.previous == 'Search'))) },
                    class: () => { return !!this.views.search.visible() ? 'd-flex' : 'd-none' }
                }
            },
        }
    },
    methods: {
        simpleContainerClass(view) {
            if (!!this.views.full(view)) {
                return 'full-overlap-view'
            } else {
                return 'overlap-view'
            }   
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
    created() {
        setTimeout(() => {
            this.checkJoinParty()
        }, 100)
    },
    mounted() {
        this.$route.meta.customTitle = this.rsd.gamestate.current
    },
}

</script>

<style lang="less">
.build-sheet {
    overflow-y: scroll;
    overflow-x: clip;
    height: calc(~"100vh - 80px");
}

.page-current {
    --pageButtonBorder: #064444;
    border-left-color: var(--pageButtonBorder) !important;
    border-left-style: solid;
    border-left-width: 4px;
}

.view-space {
    width: calc(~"100vw - 492px");
}

.page-button,
.page-button::before {
    border-radius: 0px !important;
}

.page-button:hover::before {
    opacity: 0.1;
}

.page-current::before {
    opacity: 0.1;
}

.page-current:hover::before {
    opacity: 0.2;
}

.page-current.theme--dark {
    --pageButtonBorder: #f5daab;
}
</style>