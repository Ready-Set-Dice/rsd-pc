<template>
    <div>
        <AddConditionBothDialog ref="addConditionBothDialog" />
        <AddConditionDialog ref="addConditionDialog" />
        <AddConditionDurationDialog ref="addConditionDurationDialog" />
        <AddConditionValueDialog ref="addConditionValueDialog" />
        <AddPersistentDamageDialog ref="addPersistentDamageDialog" />

        <BaseConfirmDialog ref="confirmDialog" />

        <CombatantHealthDialog ref="combatantHealthDialog" />
        <CombatInitiativeDialog ref="combatInitiativeDialog" />

        <DamageDialog ref="damageDialog" />

        <HealDialog ref="healDialog" />

        <PartyJoinDialog ref="partyJoinDialog" />
        <PersistentDamageDialog ref="persistentDamageDialog" />
        <PlayerCharacterDialog ref="playerCharacterDialog" />
        <PlayerCharacterLevelDialog ref="playerCharacterLevelDialog"/>
        <PlayerCharacterStyleDialog ref="playerCharacterStyleDialog" />

        <RecoveryCheckDialog ref="recoveryCheckDialog" />

        <SnackbarManager ref="snackbarManager" />

        <TemporaryHPDialog ref="temporaryHPDialog" />
        
    </div>
</template>

<script>
import AddConditionBothDialog from '@root/.shared/components/AddConditionBothDialog'
import AddConditionDialog from '@root/.shared/components/AddConditionDialog'
import AddConditionDurationDialog from '@root/.shared/components/AddConditionDurationDialog'
import AddConditionValueDialog from '@root/.shared/components/AddConditionValueDialog'
import AddPersistentDamageDialog from '@root/.shared/components/AddPersistentDamageDialog'

import BaseConfirmDialog from '@root/.shared/components/base/BaseConfirmDialog'

import CombatantHealthDialog from '@root/.shared/components/CombatantHealthDialog'
import CombatInitiativeDialog from '@root/.shared/components/CombatInitiativeDialog'
import ConfirmDialog from '@root/.shared/components/ConfirmDialog'

import DamageDialog from '@root/.shared/components/DamageDialog'

import HealDialog from '@root/.shared/components/HealDialog'

import PartyJoinDialog from '@/components/PartyJoinDialog'
import PersistentDamageDialog from '@root/.shared/components/PersistentDamageDialog'
import PlayerCharacterDialog from '@/components/PlayerCharacterDialog'
import PlayerCharacterLevelDialog from '@/components/PlayerCharacterLevelDialog'
import PlayerCharacterStyleDialog from '@/components/PlayerCharacterStyleDialog'

import RecoveryCheckDialog from '@root/.shared/components/RecoveryCheckDialog'

import SnackbarManager from '@root/.shared/components/SnackbarManager'

import TemporaryHPDialog from '@root/.shared/components/TemporaryHPDialog'

export default {
    components: {
        AddConditionBothDialog,
        AddConditionDialog,
        AddConditionDurationDialog,
        AddConditionValueDialog,
        AddPersistentDamageDialog,

        BaseConfirmDialog,

        CombatantHealthDialog,
        CombatInitiativeDialog,
        ConfirmDialog,

        DamageDialog,

        HealDialog,

        PartyJoinDialog,
        PersistentDamageDialog,
        PlayerCharacterDialog,
        PlayerCharacterLevelDialog,
        PlayerCharacterStyleDialog,

        RecoveryCheckDialog,

        SnackbarManager,

        TemporaryHPDialog,

    },
    computed: {
    },
    data() {
        return {
            combatDialog: false,
        }
    },
    methods: {
        namedDialog(data) {
            const edit = data.attrs[0] || false
            const options = data.attrs[1] || {}
            const extra = data.attrs[2] || {}

            if (!!data.name) {
                this.getDialog(data.name).show(edit, options, extra)
            } else {
                console.log('No dialog name', data.name)
            }
        },
        confirmDialog(data) {

            // title = '', text = '', agreeFunction = () => {}, disagreeFunction = () => {}, agreeText = 'Yes', disagreeText = 'No'
            const title = data.attrs[0] || ''
            const text = data.attrs[1] || ''
            const agreeFunction = !!data.attrs[2] ? data.attrs[2] : () => {}
            const disagreeFunction = !!data.attrs[3] ? data.attrs[3] : () => {}
            const agreeText = data.attrs[4] || 'Yes'
            const disagreeText = data.attrs[5] || 'No'

            if (!!title) {
                this.getDialog('confirmDialog').show(title, text, agreeFunction, disagreeFunction, agreeText, disagreeText)
            }
        },
        snackbarMessage(data) {
            const title = data.attrs[0] || ''
            const text = data.attrs[1] || ''

            if (!!title) {
                this.getDialog('snackbarManager').show({title: title, text: text})
            }
        }
    },
    watch: {
        dialogUID (newVal, oldVal) {
            if (newVal != oldVal) {
                
                if (!!this.dialog && !!this.dialog.name) {
                    if (this.dialog.name == 'snackbarManager') {
                        this.snackbarMessage(this.dialog)
                    } else if (this.dialog.name == 'confirmDialog') {
                        this.confirmDialog(this.dialog)
                    } else {
                        this.namedDialog(this.dialog)
                    }
                }
            }
        },
    },
}
</script>
