<template>
    <div>
        <BaseSpeedDial ref="speedDial" :menu="!!currentContent ? currentContent.getDailMenu() : null" />
        <BaseBottomSheetMenu ref="bottomSheet" :members="bottomSheetMembers" />
    </div>
</template>

<script>
import BaseBottomSheetMenu from '@root/.shared/components/base/BaseBottomSheetMenu'
import BaseSpeedDial from '@root/.shared/components/base/BaseSpeedDial'

import CharacterOverviewMenu from './CharacterOverviewMenu'
import CharacterMenu from './CharacterMenu'
import CombatMenu from './CombatMenu'

export default {
    components: {
        BaseBottomSheetMenu,
        BaseSpeedDial,
    },
    computed: {
        bottomSheetMembers() {
            if (!!this.isPartyOverview) {
                return []
            } else if (!!this.isCharacterSelected) {
                return []
            } else if (!!this.isCharacterOverview) {
                return this.playerCharacterArray
            } else if (!!this.isCombatOverview) {
                return [] // TODO: use this.combatantsArray once the GM allows & it's implemented
            } else {
                return null
            }
        },

        currentContent() {
           if (!!this.isPartyOverview) {
                return CharacterMenu
            } else if (!!this.isCharacterSelected) {
                return CharacterMenu
            } else if (!!this.isCharacterOverview) {
                return CharacterOverviewMenu
            }  else if (!!this.isCombatOverview) {
                return CombatMenu
            } else {
                return null
            }
        }
    },
    data() {
        return {
        }
    },
    methods: {
        openBottomSheet(data) {
            if (!!data && !!data.name) {
                if (!!this.bottomSheetMembers && this.bottomSheetMembers.lenth > 0) {
                    this.getDialog('bottomSheet').open(this.currentContent.getBottomSheet(data.name))
                } else if (!!this.$rsd.playercharacters.active) {
                    this.getDialog('bottomSheet').open(this.currentContent.getBottomSheet(data.name), this.$rsd.playercharacters.active)
                }
            }
        },
    },
    watch: {
        bottomsheetUID (newVal, oldVal) {
            if (newVal != oldVal) {
                
                if (!!this.bottomsheet && !!this.bottomsheet.name) {
                    this.openBottomSheet(this.bottomsheet)
                }
            }
        },
    },
}
</script>