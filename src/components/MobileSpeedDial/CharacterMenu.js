import { MobileActionMenu } from '@root/.shared/classes/MobileActionMenu'
import { dmgTypes, healTypes, conditionTypes } from '@root/.shared/constants/gametypes'

const SHEETS = {
    'edit': [
        {icon: 'mdi-palette', text: 'Change style', value:'style',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'playerCharacterStyleDialog', attrs: [true, {...item}]})
            }
        }},
        {icon: 'mdi-form-textbox', text: 'Rename character', value:'rename',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'playerCharacterDialog', attrs: [true, {...item}]})
            }
        }},
        {icon: 'mdi-arrow-up-bold-hexagon-outline', text: 'Set character level', value:'level',
        function: (item) => {
            if (!!item) {
                MENU.$rsd.dialog.open({name: 'playerCharacterLevelDialog', attrs: [true, {...item}]})
            }
        }},
    ],
    'action': [
        {icon: 'mdi-sword', text: 'Deal damage', value:'damage', multiple: true, subitems: dmgTypes,
        function: (items, type) => {
            if (!!type && !!items && items.length > 0) {
                let immune = false
                let resistant = false
                let vulnerable = false
                items.forEach(selected => {
                    if (!!selected) {
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.immunities && selected.object.hpinfo.immunities.length > 0) {
                            selected.object.hpinfo.immunities.forEach(im => {
                                if (!!im && !!im.type) {
                                    immune = !!immune || im.type == type
                                }
                            })
                        }
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.resistances && selected.object.hpinfo.resistances.length > 0) {
                            selected.object.hpinfo.resistances.forEach(im => {
                                if (!!im && !!im.type) {
                                    resistant = !!resistant || im.type == type
                                }
                            })
                        }
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.weaknesses && selected.object.hpinfo.weaknesses.length > 0) {
                            selected.object.hpinfo.weaknesses.forEach(im => {
                                if (!!im && !!im.type) {
                                    vulnerable = !!vulnerable || im.type == type
                                }
                            })
                        }
                    }
                })

                MENU.$rsd.dialog.open({name: 'damageDialog', attrs: [true, 
                    {value:1, affected: items, dmg: type}, 
                    {immune: immune, resistant: resistant, vulnerable: vulnerable}]
                })
            }
        }},
        {icon: 'mdi-heart-plus', text: 'Perform healing', value:'heal', multiple: true, subitems: healTypes,
        function: (items, type) => {
            if (!!type && !!items && items.length > 0) {
                if (type == 'regular') {
                    MENU.$rsd.dialog.open({name: 'healDialog', attrs: [true, {value:1, affected: items}]})
                } else if (type == 'temporary') {
                    MENU.$rsd.dialog.open({name: 'temporaryHPDialog', attrs: [true, {value: 1, duration:0, affected: items}]})
                }
            }
        }},
        {icon: 'mdi-virus-outline', text: 'Add a condition', value:'condition', multiple: true, subitems: conditionTypes,
        function: (items, type) => {
            if (!!type && !!items && items.length > 0) {
                const duration = MENU.$rsd.conditions.hasDuration(type)
                const value = MENU.$rsd.conditions.hasValue(type)

                let immune = false
                items.forEach(selected => {
                    if (!!selected) {
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.immunities && selected.object.hpinfo.immunities.length > 0) {
                            selected.object.hpinfo.immunities.forEach(im => {
                                if (!!im && !!im.type) {
                                    immune = !!immune || im.type == type
                                }
                            })
                        }
                    }
                })
                
                if (!!duration && !!value) {
                    MENU.$rsd.dialog.open({name: 'addConditionBothDialog', attrs: [false, {type: type, duration:0, value:1, floor: false, reduce: false, affected: items}, {immune: immune}]})
                } else if (!!duration) {
                    MENU.$rsd.dialog.open({name: 'addConditionDurationDialog', attrs: [false, {type: type, duration:0, affected: items}, {immune: immune}]})
                } else if (!!value) {
                    MENU.$rsd.dialog.open({name: 'addConditionValueDialog', attrs: [false, {type: type, value:1, floor: false, reduce: false, affected: items}, {immune: immune}]})
                } else {
                    items.forEach(a => {
                        if (!!a && !!a.id) {
                            MENU.$rsd.combat.addCondition(a.id, {type: type})
                        }
                    })
                }
            }
        }},
        {icon: 'fire', text: 'Add peristent damage', value:'pdamage', multiple: true, subitems: dmgTypes,
        function: (items, type) => {
            if (!!type && !!items && items.length > 0) {
                let immune = false
                let resistant = false
                let vulnerable = false

                items.forEach(selected => {
                    if (!!selected) {
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.immunities && selected.object.hpinfo.immunities.length > 0) {
                            selected.object.hpinfo.immunities.forEach(im => {
                                if (!!im && !!im.type) {
                                    immune = !!immune || im.type == type
                                }
                            })
                        }
                
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.resistances && selected.object.hpinfo.resistances.length > 0) {
                            selected.object.hpinfo.resistances.forEach(im => {
                                if (!!im && !!im.type) {
                                    resistant = !!resistant || im.type == type
                                }
                            })
                        }
                
                        if (!!selected.object && !!selected.object.hpinfo && !!selected.object.hpinfo.weaknesses && selected.object.hpinfo.weaknesses.length > 0) {
                            selected.object.hpinfo.weaknesses.forEach(im => {
                                if (!!im && !!im.type) {
                                    vulnerable = !!vulnerable || im.type == type
                                }
                            })
                        }
                    }
                })
  
                MENU.$rsd.dialog.open({name: 'addPersistentDamageDialog', attrs: [false, 
                    {type:'persistent damage', value: 1, dmg: type, affected: items}, 
                    {immune: immune, resistant: resistant, vulnerable: vulnerable}]
                })
            }
        }},
    ]
}

class CharacterMenu extends MobileActionMenu {
    constructor() {
        super()
    }

    getBottomSheet(name) {
        return !!name && !!SHEETS[name] ? SHEETS[name] : null
    }

    getDailMenu() {
        return {
            top: true,
            buttons: [
                {icon: 'mdi-pencil', function: () => { this.$rsd.bottomsheet.open('edit') }},
                {icon: 'mdi-sword', function: () => { this.$rsd.bottomsheet.open('action') }},
                {icon: 'mdi-sort', function: () => { this.doChangeInitiative() }, show: () => { return this.getHasParty() } },
                {icon: 'mdi-heart', function: () => { this.doChangeHealth() }},
            ],
        }
    }

    getHasParty() {
        const currentItem = this.$rsd.playercharacters.active
        return !!currentItem.partyid && !!currentItem.gmid && currentItem.partyid != "localcharacter"
    }

    doChangeHealth() {
        const currentItem = this.$rsd.playercharacters.active

        if (!!currentItem && !!currentItem.id) {
            this.$rsd.dialog.open({name: 'combatantHealthDialog', attrs: [true, {...currentItem.health, name: currentItem.name, id: currentItem.id, local: true}, {maxhp: currentItem.health.maxhp}]})
        }
    }

    doChangeInitiative() {
        const currentItem = this.$rsd.playercharacters.active
        if (!!currentItem && !!currentItem.id) {
            
            const combatData = this.$rsd.combat.getMember(currentItem.id)

            if (!!combatData && (!!combatData.initiative || combatData.initiative == 0)) {
                this.$rsd.dialog.open({name: 'combatInitiativeDialog', attrs: [true, {...currentItem, id: currentItem.id, initiative: combatData.initiative}]})
            }
        }
    }


}

const MENU = new CharacterMenu()

export default MENU