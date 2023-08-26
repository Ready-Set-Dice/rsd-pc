<template>
    <v-dialog
        v-model="shown"
        scrollable
        :fullscreen="XSOnly"
        max-width="350px"
    >
        <v-card>
            <v-card-title>
                Add player
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-1">
                <v-form
                    ref="playerform"
                    v-model="valid"
                    lazy-validation
                >
                    <v-text-field
                        v-model="pcOptions.name"
                        :rules="pcnameRules"
                        :counter="30"
                        v-on:keyup.enter="addPC"
                        label="PC name"
                        prepend-icon="mdi-account-plus"
                        required
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="resetPC"
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="green darken-1"
                    text
                    @click="addPC"
                >
                    Add
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            valid: true,
            shown: false,
            pcnameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 30) || 'Must be smaller than 30 characters'
            ],
            pcOptions: {
                name: '',
            }
        }
    },
    computed: {
        XSOnly () {
            return this.$vuetify.breakpoint.name === 'xs'
        },
    },
    props: {
    },
    methods: {
        show() {
            this.shown = true
        },
        close() {
            this.shown = false
        },
        addPC() {
            if (this.$refs.playerform.validate()) {
                this.$emit('New', this.pcOptions.name)
                this.resetPC()
            }
        },
        resetPC() {
            this.close()
            this.pcOptions = null
            this.pcOptions = {}
            this.$refs.playerform.resetValidation()
        },
    }
}
</script>