<template>
    <v-dialog
    v-model="shown"
    persistent
    max-width="300"
    >
        <v-card>
            <v-card-title class="text-h5">
            {{title}}
            </v-card-title>
            <v-card-text>{{text}}</v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="disagree"
            >
                Disagree
            </v-btn>
            <v-btn
                color="green darken-1"
                text
                @click="agree"
            >
                Agree
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            shown: false,
            title: '',
            text: '',
        }
    },
    computed: {
    },
    props: {
    },
    methods: {
        show(title, text) {
            this.title = title
            this.text = text
            this.shown = true
        },
        close() {
            this.shown = false
            this.title = ''
            this.text = ''
        },
        disagree() {
            this.close()
            this.$emit('Disagree')
        },
        agree() {
            this.close()
            this.$emit('Agree')
        }
    }
}
</script>

<style>

</style>