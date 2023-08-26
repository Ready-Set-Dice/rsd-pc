<template>
    <div v-if="!!helpState" class="pa-4 flex-grow-1">
        <div class="alt-scrollbar help-view" v-html="topics[helpState.topic].pages[helpState.page]"></div>
    </div>
</template>

<script>

import GeneralWelcome from './pages/general/welcome'
import GeneralInterface from './pages/general/interface'

import Placeholder from './pages/placeholder'

export default {
    props: {
    },
    components: {
    },
    data() {
        return {
            topics: {
                general: {
                    pages: {
                        welcome: GeneralWelcome,
                        interface: GeneralInterface,
                    },
                },
                setup: {
                    pages: {
                        'creating pc': Placeholder,
                        'advanced vs basic': Placeholder,
                        'joining a party': Placeholder,
                        style: Placeholder,
                    },
                },
                combat: {
                    pages: {
                        general: Placeholder,
                        damage: Placeholder,
                        health: Placeholder,
                    },
                },
                search: {
                    pages: {
                        ancestries: Placeholder,
                        backgrounds: Placeholder,
                        classes: Placeholder,
                        spells: Placeholder,
                    },
                },
                select: (topic) => {
                    let newTopic = !!topic ? topic : 'general'
                    let newPage = this.topics[topic].pages[0].toLowerCase()

                    this.$store.dispatch('rsd/setHelpPage', {topic: newTopic, page: newPage})
                },
            },
        }
    },
    computed: {
        helpState: {
            get() {
                return this.rsd.gamestate.view.help
            }
        },
    },
    methods: {
    },
}
</script>

<style lang="less" scoped>
.help-view {
    height: calc(~"100vh - 128px");
    overflow-y: auto;
}
</style>