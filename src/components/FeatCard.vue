<template>
    <v-card 
        class="ma-1"
        elevation="3"
        @click="clickFunction"
    >
        <v-card-text class="pa-0">
            <v-list-item>
                <v-list-item-action class="mr-2" v-show="!!icon">
                    <v-skeleton-loader
                        v-show="!initiated"
                        class="small-avater"
                        type="avatar"
                    ></v-skeleton-loader>
                    <v-avatar
                        v-show="!!initiated"
                        size="41"
                        color="primary lighten-1"
                    >
                        <span
                            class="gi-icon gi-icon-big inverse"
                            :style="GameIcons.get.icon(icon)"  
                        ></span>
                    </v-avatar>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-subtitle class="icon_color--text" :class="!!rsd.darkmode ? 'text--darken-3' : 'text--light-3'">
                        <v-skeleton-loader
                            v-show="!initiated"
                            max-width="50"
                            max-height="16"
                            type="text"
                        ></v-skeleton-loader>
                        <span v-show="!!initiated">{{ type }}</span>
                    </v-list-item-subtitle>
                    <v-list-item-title :class="!!subject ? `icon_color--text ${!!rsd.darkmode ? 'text--lighten-3' : 'text--darken-3'}` : `icon_color--text ${!!rsd.darkmode ? 'text--lighten-1' : 'text--darken-1'}`">
                        <v-skeleton-loader
                            v-show="!initiated"
                            max-width="45"
                            max-height="19"
                            type="text"
                        ></v-skeleton-loader>
                        <span v-show="!!initiated">
                            {{ !!subject ? subject.name : 'Not selected' }}
                            <span v-if="$rsd.format.hasActionNumber(subject)" class="action" style="position: absolute; bottom: 14px;">
                                {{$rsd.format.actionNumber(subject)}}
                            </span>
                        </span>
                    </v-list-item-title>
                    <span v-show="!!error" class="red--text text-caption">Prerequisites not met</span>
                </v-list-item-content>
            </v-list-item>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        clickFunction: Function,
        error: Boolean,
        icon: String,
        subject: Object,
        type: String,
        initiated: Boolean,
    },
}
</script>

<style lang="css" scoped>
.small-avater >>> div.v-skeleton-loader__avatar {
    height: 41px;
    min-width: 41px;
    width: 41px;
}
</style>