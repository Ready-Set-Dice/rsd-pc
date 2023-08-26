<template>
    <v-dialog
        v-model="shown"
        scrollable
        :fullscreen="XSOnly"
        max-width="300px"
    >
        <v-card>
            <v-card-title>
                Set initiative
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-1">
                <v-form
                    ref="initiativeform"
                    v-model="valid"
                    lazy-validation
                >
                    <h3 class="mt-2 mb-4">PC: {{name}}</h3>
                    <v-text-field
                        v-model="initiative"
                        type="number"
                        v-on:keyup.enter="setInitiative"
                        label="Initiative"
                        prepend-icon="mdi-format-list-numbered"
                        required
                        @focus="$event.target.select()"
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
            <v-btn
                color="blue darken-1"
                text
                @click="resetInitiative"
            >
                Cancel
            </v-btn>
            <v-btn
                color="green darken-1"
                text
                @click="setInitiative"
            >
                Set
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
            name: '',
            initiative: 0
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
        show(name) {
            this.name = name
            this.shown = true
        },
        close() {
            this.shown = false
        },
        setInitiative() {
            if (this.$refs.initiativeform.validate()) {
                this.$emit('Set', this.initiative)
                this.resetInitiative()
            }
        },
        resetInitiative() {
            this.close()
            this.name = ''
            this.initiative = 0
            this.$refs.initiativeform.resetValidation()
        },
    }
}
</script>