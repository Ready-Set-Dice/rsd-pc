import { dmgTypes, healTypes, conditionTypes } from '@root/.shared/constants/gametypes'

export default {
    data() {
        return {
            refreshCombatantKey: 0,

            strengthTypes: [
                {type: 'elite'},
                {type: 'normal'},
                {type: 'weak'},
            ],

            combatAddTypes: [
                {type: 'party'},
                {type: 'combatant'},
            ],

            playerConditions: {
                regular: [
                    {type: 'blinded'},
                    {type: 'concealed'},
                    {type: 'clumsy'},
                    {type: 'dying'},
                    {type: 'enfeebled'},
                    {type: 'fatigued'},
                    {type: 'flat-Footed'},
                    {type: 'frightened'},
                    {type: 'grabbed'},
                    {type: 'hidden'},
                    {type: 'immobilized'},
                    {type: 'prone'},
                    {type: 'restrained'},
                    {type: 'stunned'},
                    {type: 'sickened'},
                    {type: 'wounded'},
                ],
                other: [
                    {type: 'broken'},
                    {type: 'confused'},
                    {type: 'controlled'},
                    {type: 'dazzled'},
                    {type: 'deafened'},
                    {type: 'doomed'},
                    {type: 'drained'},
                    {type: 'encumbered'},
                    {type: 'fascinated'},
                    {type: 'fleeing'},
                    {type: 'invisible'},
                    {type: 'paralyzed'},
                    {type: 'petrified'},
                    {type: 'quickened'},
                    {type: 'slowed'},
                    {type: 'stupified'},
                    {type: 'unconscious'},
                    {type: 'undetected'},
                    {type: 'unnoticed'},
                    
                ]
            },
            npcConditions: {
                regular: [
                    {type: 'blinded'},
                    {type: 'concealed'},
                    {type: 'confused'},
                    {type: 'clumsy'},
                    {type: 'dazzled'},
                    {type: 'enfeebled'},
                    {type: 'flat-Footed'},
                    {type: 'frightened'},
                    {type: 'grabbed'},
                    {type: 'hidden'},
                    {type: 'immobilized'},
                    {type: 'paralyzed'},
                    {type: 'prone'},
                    {type: 'restrained'},
                    {type: 'stunned'},
                    {type: 'sickened'},
                ],
                other: [
                    {type: 'broken'},
                    {type: 'controlled'},
                    {type: 'dying'},
                    {type: 'deafened'},
                    {type: 'doomed'},
                    {type: 'drained'},
                    {type: 'encumbered'},
                    {type: 'fatigued'},
                    {type: 'fascinated'},
                    {type: 'fleeing'},
                    {type: 'invisible'},
                    {type: 'petrified'},
                    {type: 'quickened'},
                    {type: 'slowed'},
                    {type: 'stupified'},
                    {type: 'unconscious'},
                    {type: 'unnoticed'},
                    {type: 'undetected'},
                    {type: 'wounded'},                    
                ]
            },
        }
    },
    computed: {
        dmgTypes() {
            return dmgTypes
        },
        healTypes() {
            return healTypes
        },
        conditionTypes() {
            return conditionTypes
        },
        characterObject() {
            const member = this.$rsd.playercharacters.active
            const key = this.$rsd.playercharacters.activeKey
            const basestats = this.$rsd.playercharacters.getStats()
            const object = this.$rsd.playercharacters.getObject()
            const stats = this.$rsd.conditions.getStatsObject(member, basestats, member.conditions, object)

            const memberObject = {
                ...member,
                _key: key,
                pcid: key,
                basestats: basestats,
                name: member.name,
                object: object,
                stats: stats,
            }

            return memberObject
        },
        combat() {
            return this.$store.getters['remotedb/combat']
        },
        combatantsArray: {
            get() {
                this.refreshCombatantKey;
                return this.$rsd.combat.getCombatantsArray()
            },
        },
        playerCharacterArray: {
            get() {
                return this.$store.getters['remotedb/playerCharacterArray']
            },
            set(value) {
                this.$rsd.playercharacters.setArray(value)
            }
        },
        membersArray: {
            get() {
                return this.$rsd.members.getMembersArray()
            },
        },

        isTouchDevice() {
            return (('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0));
        },

        
        isPartyOverview() {
            return this.mobileView.navigation == 'Characters' && !!this.mobileView.characterSelected && !!this.mobileView.submenuSelected && !!this.mobileView.overviewSelected  && this.mobileView.overview == 'party'
        },
        // isBuildSelected() {
        //     return this.mobileView.navigation == 'Characters' && !!this.mobileView.characterSelected && !!this.mobileView.submenuSelected && !!this.mobileView.buildSelected
        // },
        // isOverviewSelected() {
        //     return this.mobileView.navigation == 'Characters' && !!this.mobileView.characterSelected && !!this.mobileView.submenuSelected && !!this.mobileView.overviewSelected 
        // },
        // isSubmenuSelected() {
        //     return this.mobileView.navigation == 'Characters' && !!this.mobileView.characterSelected && !!this.mobileView.submenuSelected
        // },
        isCharacterSelected() {
            return this.mobileView.navigation == 'Characters' && !!this.mobileView.characterSelected
        },
        isCharacterOverview() {
            return this.mobileView.navigation == 'Characters' && !this.mobileView.characterSelected
        },
        isCombatOverview() {
            return this.mobileView.navigation == 'Combat'
        },

    },
}