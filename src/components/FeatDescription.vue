<template>
    <div v-if="!!feat">
        <div v-if="!!feat.system">
            <span
                :class="!!feat.system.description && !!feat.system.description.value && feat.system.description.value.length > 1 ? 'pointer' : null"
                @click="!!feat.system.description && !!feat.system.description.value && feat.system.description.value.length > 1 ? toggleOpenFeatDescription(feat._id) : null"
            >
                <span class="font-weight-medium">{{!!feat.name ? feat.name : null}}</span>
                <span v-if="$rsd.format.hasActionNumber(feat.system, 'feats')" class="action">{{$rsd.format.actionNumber(feat.system)}}</span>
                <v-icon 
                    class="ml-n1"
                    :class="!buildView.open.includes(feat._id)? 'mt-n1 mb-1' : ''"
                    v-show="!!feat.system.description && !!feat.system.description.value && feat.system.description.value.length > 1"
                >{{!!buildView.open.includes(feat._id) ? 'mdi-menu-down' : 'mdi-menu-up'}}</v-icon>
            </span>
            <div class="mx-2" v-show="!!buildView.open.includes(feat._id)" v-html="$sanitize(feat.system.description.value)"></div>
            <slot name="after"></slot>
        </div>
    </div>
</template>

<script>
import FeatCard from '@/components/FeatCard'

export default {
    components: {
        FeatCard,
    },
    props: {
        feat: Object
    },
    methods: {
        toggleOpenFeatDescription(index) {
            this.$store.dispatch('rsd/setBuildViewOpen', index)
        },
    }
}
</script>

<style>

</style>