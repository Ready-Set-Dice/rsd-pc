<template>
    <v-chip
        label
        :class="clss"
        :x-small="XSOnly"
        :small="!XSOnly"
        :color="color"
        @click="$emit('Clicked')"
        @click.stop=""
        @mousedown.stop=""
        @touchstart.stop=""
        dark
    >
        <v-icon 
            left
            :x-small="XSOnly"
            :small="!XSOnly"
        >
            {{icon}}
        </v-icon>
        <span v-if="modifier && positiveModifier">+</span>{{text}}<span v-if="check">*</span><span v-if="speed">&nbsp;ft.</span>
    </v-chip>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: {
        clss: String,
        color: String,
        text: String,
        icon: String,
        clickfunc: Function,
        valA: Number,
        valB: Number,
        type: String,
        special: Object,
    },
    computed: {
        XSOnly () {
            return this.$vuetify.breakpoint.name === 'xs'
        },
        positiveModifier() {
            const value = Number(this.text)
            if (value && value >= 0) {
                return true
            } else {
                return false
            }
        },
        speed() {
            return this.type && this.type == 'speed'
        },
        modifier() {
            return this.type && this.type == 'modifier'
        },
        check() {
            return this.valA && this.valB && this.valA != this.valB
        }
    },
    methods: {
    }
}
</script>