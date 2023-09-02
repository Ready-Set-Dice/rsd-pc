export class CombatTrackerHelper {
    constructor () {
    }

    SetConditions(conditions) {
        this.conditions = conditions
    }

    HealCombatant(parent, amount, receiver) {
        // TODO: stuff with healing a downed PC
        // parent.addCondition
        // parent.changeCondition

        const combatant = receiver.item
        const membersData = parent.membersData[combatant.id]
        const membersConditions = parent.membersConditions[combatant.id]
        if (membersData != null && membersData.hp != null) {
            if (Number(membersData.hp) < Number(membersData.maxhp)) {
                const maxAmount = Math.min((Number(membersData.maxhp) - Number(membersData.hp)), Number(amount))
                parent.membersData[combatant.id].hp += maxAmount
            }

            if (membersConditions && membersConditions.length > 0) {
                const dyingIndex = membersConditions.findIndex((c) => c.name == 'Dying')
                if (dyingIndex != -1) {
                    this.RemoveDying(parent, membersConditions[dyingIndex], dyingIndex, combatant.id)
                    this.AddOrChangeWounded(parent, combatant, membersConditions)

                    // 
                } else {
                    const unconIndex = membersConditions.findIndex((c) => c.name == 'Unconscious')
                    if (unconIndex != -1) {
                        const condition = {...membersConditions[unconIndex], conditionIndex: unconIndex, combatantID: combatant.id}
                        parent.removeCondition(condition)
                    }
                }
            }
            parent.updateCombatMembersData()
        }
    }

    DamageCombatant(parent, amount, receiver, instigator, critical) {
        const combatant = receiver.item
        const membersData = parent.membersData[combatant.id]
        const membersConditions = parent.membersConditions[combatant.id]
        let remainingAmount = Number(amount)
        
        if (membersData != null && membersData.hp != null) {
            if (membersData.temphp > 0) {
                if (remainingAmount >= Number(membersData.temphp)) {
                    remainingAmount = remainingAmount - Number(membersData.temphp)
                    parent.membersData[combatant.id].temphp = null

                    // TODO: Fix this
                    if (membersConditions && membersConditions.length > 0) {
                        const conditionIndex = membersConditions.findIndex((c) => c.name == 'Temporary HP')
                        if (conditionIndex != -1) {
                            const condition = {conditionIndex: conditionIndex, combatantID: combatant.id}
                            parent.removeCondition(condition)
                        }
                    }
                } else {
                    parent.membersData[combatant.id].temphp = Number(membersData.temphp) - remainingAmount
                    remainingAmount = 0
                }
            }

            if (remainingAmount > 0) {
                if (Number(membersData.hp) - remainingAmount > 0) {
                    parent.membersData[combatant.id].hp -= remainingAmount

                    if (membersConditions && membersConditions.length > 0) {
                        const unconIndex = membersConditions.findIndex((c) => c.name == 'Unconscious')
                        if (unconIndex != -1) {
                            const condition = {...membersConditions[unconIndex], conditionIndex: unconIndex, combatantID: combatant.id}
                            parent.removeCondition(condition)
                        }
                    }
                } else {
                    if (combatant.type == 'npc') {
                        parent.openKillCombatantDialog(receiver.index)
                    } else if (combatant.type == 'pc') {
                        if (membersConditions) {
                            const dyingIndex = membersConditions.findIndex((c) => c.name == 'Dying')
                            const woundedIndex = membersConditions.findIndex((c) => c.name == 'Wounded')

                            let newDyingCount = 1

                            
                            console.log("damaging ", dyingIndex, woundedIndex)

                            if (critical) {
                                newDyingCount += 1
                            }

                            if (woundedIndex != -1) {
                                newDyingCount += Number(membersConditions[woundedIndex].value)
                            }

                            if (dyingIndex != -1) {
                                newDyingCount += Number(membersConditions[dyingIndex].value)
                                this.ChangeDying(parent, dyingIndex, membersConditions, combatant.id, newDyingCount)
                            } else {
                                this.AddDying(parent, combatant.id, newDyingCount)

                                // this.AddUnconscious(parent, combatant.id, membersConditions)
                            }
                        } else {
                            let newDyingCount = 1

                            this.AddDying(parent, combatant.id, newDyingCount)

                            // this.AddUnconscious(parent, combatant.id, membersConditions)
                        }

                        parent.membersData[combatant.id].hp = 0

                        if (receiver.index != instigator.index) {
                            let newCombat = this.MoveDownedPC(parent, receiver, instigator)

                            parent.members = newCombat.combatants
                            parent.combat.curInit = newCombat.curInit
                        }

                        // parent.updateCombatMembersData()

                        // TODO: Stuff with death condition & wounded
                        // parent.addCondition
                        // parent.changeCondition

                    }
                }
            }

            parent.updateCombat()
            parent.updateCombatMembers()
            parent.updateCombatMembersData()
        }
    }

    MoveDownedPC(parent, receiver, instigator) {
        let newCombatants = []
        let counting = true
        let newInit = -1
        parent.members.forEach((c,i) => {
            if (i==instigator.index) {
                newCombatants.push(parent.members[receiver.index])
                newCombatants.push(c)
                newInit += 2
                counting = false
            } else if (i != receiver.index) {
                newCombatants.push(c)
                if (counting) {
                    newInit += 1
                }
            }
        })

        return {combatants: newCombatants, curInit: newInit}
    }

    TempHPCombatant(parent, amount, duration, receiver) {
        const combatant = receiver.item
        const membersConditions = parent.membersConditions[combatant.id]
        parent.membersData[combatant.id].temphp = Number(amount)
        parent.updateCombatMembersData()

        if (membersConditions && membersConditions.length > 0) {
            const conditionIndex = membersConditions.findIndex((c) => c.name == 'Temporary HP')
            if (conditionIndex != -1) {
                const condition = {conditionIndex: conditionIndex, combatantID: combatant.id}
                parent.removeCondition(condition)
            }
        }

        const conditionOptions = {
            selectedCondition: 'Temporary HP',
            cantReducePastOne: false, 
            damageType: '', 
            reduceOnEndTurn: false, 
            duration: Number(duration), 
            value: 0, 
            name: 'Temporary HP',
            combatantID: combatant.id
        }

        parent.addCondition(conditionOptions)
    }

    RecoveryCheck(parent, check, dc, receiver) {
        // const combatant = parent.combat.combatants[combatantIndex]
        // console.log(check, dc, combatant)
        const combatant = receiver.item
        const membersConditions = parent.membersConditions[combatant.id]
        if (combatant != null) {
            const dyingIndex = membersConditions.findIndex((c,i) => c.name == 'Dying')
            if (dyingIndex != -1) {
                let dyingValue = Number(membersConditions[dyingIndex].value)

                if (check >= dc + 10) { // Crit Success
                    if (dyingValue > 2) {
                        this.ChangeDying(parent, dyingIndex, membersConditions, combatant.id, dyingValue-2)
                        return true
                    } else {
                        this.RemoveDying(parent, membersConditions[dyingIndex], dyingIndex, combatant.id, true)
                        this.AddOrChangeWounded(parent, combatant, membersConditions)
                        return true
                    }
                } else if (check >= dc) {  // Success
                    if (dyingValue > 1) {
                        this.ChangeDying(parent, dyingIndex, membersConditions, combatant.id, dyingValue-1)
                        return true
                    } else {
                        this.RemoveDying(parent, membersConditions[dyingIndex], dyingIndex, combatant.id, true)
                        this.AddOrChangeWounded(parent, combatant, membersConditions)
                        return true
                    }
                } else if (check > dc - 10) { // Fail
                    this.ChangeDying(parent, dyingIndex, membersConditions, combatant.id, dyingValue+1)
                    return true
                } else { // Crit fail
                    this.ChangeDying(parent, dyingIndex, membersConditions, combatant.id, dyingValue+2)
                    return true
                }
            }
        }
        return false
    }

    PDCheck(parent, check, dc, combatant) {
        // const combatant = parent.combat.combatants[combatantID]
        const membersConditions = parent.membersConditions[combatant.item.id]
        if (combatant != null) {
            const pdIndex = membersConditions.findIndex((c,i) => c.name == 'Persistent Damage')
            if (pdIndex != -1) {
                if (check >= dc ) { // Success
                    const condition = {conditionIndex: pdIndex, combatantID: combatant.item.id}
                    parent.removeCondition(condition)
                    return true
                } else { // Fail
                    return true
                }
            }
        }
        return false
    }

    ChangeDying(parent, dyingIndex, conditions, combatantID, newValue) {
        let dyingCondition = {...conditions[dyingIndex]}
        dyingCondition.value = newValue
        dyingCondition.combatantID = combatantID
        dyingCondition.conditionIndex = dyingIndex
        parent.changeCondition(dyingCondition)
    }

    RemoveDying(parent, dyingCond, dyingIndex, combatantID, ignoreLinkedConditions = false) {
        const condition = {...dyingCond, conditionIndex: dyingIndex, combatantID: combatantID}
        parent.removeCondition(condition, ignoreLinkedConditions)
    }

    AddOrChangeWounded(parent, combatant, membersConditions) {
        const woundedIndex = membersConditions.findIndex((c) => c.name == 'Wounded')
        console.log("AddOrChangeWounded", combatant, membersConditions, woundedIndex)
        if (woundedIndex != -1) {
            let woundedCondition = {...membersConditions[woundedIndex]}
            woundedCondition.value = Number(woundedCondition.value) + 1
            woundedCondition.combatantID = combatant.id
            woundedCondition.conditionIndex = woundedIndex

            parent.changeCondition(woundedCondition)
        } else {
            const selectedCondtion = this.conditions.find((c,i) => c.name == 'Wounded')
            const woundedOptions = {
                selectedCondition: selectedCondtion.name,
                id: selectedCondtion._id,
                cantReducePastOne: false, 
                damageType: '', 
                reduceOnEndTurn: false, 
                duration: 0, 
                value: 1, 
                name: 'Wounded',
                combatantID: combatant.id
            }

            parent.addCondition(woundedOptions)
        }
    }

    AddDying(parent, combatantID, newDyingCount) {
        const dyingCondtion = this.conditions.find((c,i) => c.name == 'Dying')
        const dyingOptions = {
            selectedCondition: dyingCondtion.name,
            id: dyingCondtion._id,
            cantReducePastOne: false, 
            damageType: '', 
            reduceOnEndTurn: false, 
            duration: 0, 
            value: newDyingCount, 
            name: 'Dying',
            combatantID: combatantID
        }

        parent.addCondition(dyingOptions)
    }

    // AddUnconscious(parent, combatantID, membersConditions) {
    //     let unconIndex = -1
    //     if (membersConditions) {
    //         membersConditions.findIndex((c) => c.name == 'Unconscious')
    //     }

    //     if (unconIndex == -1) {
    //         const unconCondtion = this.conditions.find((c,i) => c.name == 'Unconscious')
    //         const unconOptions = {
    //             selectedCondition: unconCondtion.name,
    //             id: unconCondtion._id,
    //             cantReducePastOne: false, 
    //             damageType: '', 
    //             reduceOnEndTurn: false, 
    //             duration: 0, 
    //             value: 0, 
    //             name: 'Unconscious',
    //             combatantID: combatantID
    //         }

    //         parent.addCondition(unconOptions)
    //     }
    // }

    CompareInitiative(a,b) {
        if ((Number(a.initiative) && Number(b.initiative) && Number(a.initiative) < Number(b.initiative)) ||
            (!Number(a.initiative) && !Number(a.initiative))) {
            return 1
        } else {
            return -1
        }
    }

    ChipColor(condition, avatar) {
        switch(condition.name) {
            case 'Custom':
                if (avatar)
                    return 'lime--text text--darken-3 white'
                else
                    return 'lime darken-3'
            case 'Blinded':
            case 'Deafened':
            case 'Dazzled':
            case 'Invisible':
            case 'Concealed':
                if (avatar)
                    return 'blue-grey--text text--lighten-2 white'
                else
                    return 'blue-grey lighten-2'
            case 'Broken':
                return 'brown darken-3'
            case 'Clumsy':
            case 'Drained':
            case 'Enfeebled':
            case 'Stupefied':
                if (avatar)
                    return 'green--text text--accent-4 white'
                else
                    return 'green accent-4'
            case 'Hidden':
            case 'Observed':
            case 'Unnoticed':
            case 'Undetected':
                if (avatar)
                    return 'deep-purple--text text--lighten-2 white'
                else
                    return 'deep-purple lighten-1'
            case 'Confused':
                if (avatar)
                    return 'purple--text text--darken-1 white'
                else
                    return 'purple darken-1'
            case 'Controlled':
                return 'indigo darken-3'
            case 'Doomed':
                if (avatar)
                    return 'red--text text--darken-4 white'
                else
                    return 'red darken-4'
            case 'Dying':
                if (avatar)
                    return 'red--text text--darken-2 white'
                else
                    return 'red darken-2'
            case 'Unconscious':
                if (avatar)
                    return 'indigo--text text--lighten-2 white'
                else
                    return 'indigo lighten-2'
            case 'Wounded':
                if (avatar)
                    return 'deep-orange--text text--darken-2 white'
                else
                    return 'deep-orange darken-4'
            case 'Encumbered':
            case 'Fatigued':
                if (avatar)
                    return 'brown--text text--lighten-2 white'
                else
                    return 'brown lighten-2'
            case 'Fascinated':
                return 'pink darken-4'
            case 'Off-Guard':
                if (avatar)
                    return 'deep-orange--text text--darken-1 white'
                else
                    return 'deep-orange darken-1'
            case 'Frightened':
            case 'Fleeing':
                if (avatar)
                    return 'deep-purple--text text--darken-2 white'
                else
                    return 'deep-purple darken-3'
            case 'Friendly':
            case 'Helpful':
            case 'Indifferent':
            case 'Hostile':
            case 'Unfriendly':
                if (avatar)
                    return 'light-blue--text text--lighten-1 white'
                else
                    return 'light-blue lighten-1'
            case 'Grabbed':
            case 'Immobilized':
            case 'Paralyzed':
            case 'Restrained':
                if (avatar)
                    return 'teal--text text--lighten-1 white'
                else
                    return 'teal lighten-1'
            case 'Persistent Damage':
                if (avatar)
                    return 'red'
                else
                    return 'red darken-1'
            case 'Petrified':
                if (avatar)
                    return 'blue-grey--text text--darken-2 white'
                else
                    return 'blue-grey darken-2'
            case 'Prone':
                return 'brown lighten-1'
            case 'Quickened':
                if (avatar)
                    return 'amber--text text--darken-1 white'
                else
                    return 'amber darken-1'
            case 'Sickened':
                if (avatar)
                    return 'light-green--text text--darken-2 white'
                else
                    return 'light-green darken-2'
            case 'Slowed':
            case 'Stunned':
                if (avatar)
                    return 'cyan--text text--darken-3 white'
                else
                    return 'cyan darken-3'
            case 'Temporary HP':
                if (avatar)
                    return 'blue--text text--lighten-4 white'
                else
                    return 'blue lighten-4'
            default:
                return ''
        }
    }
}

export default CombatTrackerHelper