<template>
    <div class="fill-height">
        <div class="d-flex flex-column fill-height">
            <div class="flex-row fill-height d-flex">
                <v-list
                    dense
                    class="d-flex flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                    :style="`width:${playercharacters.width}px;`"
                >
                    <v-list-item
                        link 
                        class="pl-2 pr-4 py-1 no-flex accent-item"
                        :class="!!settingsState && !!settingsState.account ? 'accent-selected' : ''"
                        @click="playercharacters.select(true, null)"
                    >
                        <v-list-item-content class="py-0">
                            <v-list-item-title>Account</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item 
                        v-for="(playercharacter, index) in playerCharacterArray"
                        :key="'settings-'+index"
                        link
                        class="pl-2 pr-4 py-1 no-flex accent-item"
                        :class="!!settingsState && !settingsState.account && !!settingsState.playercharacter && settingsState.playercharacter == playercharacter.id ? 'accent-selected' : ''"
                        @click="playercharacters.select(false, playercharacter.id)"
                    >
                        <v-list-item-content class="py-0">
                            <v-list-item-title>{{playercharacter.name}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <div 
                    class="d-flex fill-height right-border"
                ></div>
                <v-list
                    dense
                    class="d-flex flex-grow-1 py-0 flex-column alt-scrollbar content-list"
                    :style="`width:${pages.width}px;`"
                >
                    <v-list-item
                        v-for="(page, index) in settingPages" :key="'page-'+index"
                        link 
                        class="pl-2 pr-4 py-1 no-flex accent-item"
                        :class="page.toLowerCase() == settingsState.page ? 'accent-selected' : ''"
                        @click="!!page ? pages.select(page.toLowerCase()) : null"
                    >
                        <v-list-item-content>
                            <v-list-item-title>{{page}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <div 
                    class="d-flex fill-height right-border"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
    },
    components: {
    },
    data() {
        return {
            playercharacters: {
                width: 150,
                select: (account, playercharacter) => {
                    this.$store.dispatch('rsd/setSettingsPage', {account: !!account, playercharacter: !!playercharacter ? playercharacter : null})
                },
            },
            pages: {
                width: 150,
                select: (page) => {
                    this.$store.dispatch('rsd/setSettingsPage', {page: !!page ? page : ''})
                },
            },
            // settingPages: ['Build'],
            settingPages: [''],
            
        }
    },
    computed: {
        settingsState: {
            get() {
                return this.rsd.gamestate.view.settings
            }
        },
    },
    methods: {
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
    height: calc(~"100vh - 82px");
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