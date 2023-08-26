const EventEmitter = require('events')

class CombatViewerService extends EventEmitter {
    constructor() {
        super()
    }

    init(database, getAuth, ref, off, onValue) {
        this.database = database
        this.getAuth = getAuth

        this.ref = ref
        this.off = off
        this.onValue = onValue

        this.reset()

        // console.log("GMManagerService init")
    }

    unload() {
        this.reset()
    }

    load() {
        const auth = this.getAuth()
        const curuser = auth.currentUser
        if (curuser) {
            // console.log(curuser)
            this.useruid = curuser.uid

            this._dbCurrentCombat = null
            this._dbCurrentMembers = null
            this._dbCurrentMembersData = null
            this._dbCurrentMembersConditions = null
        }
    }

    reset() {
        this._gmid = null
        this._partyid = null

        this._combat = {
            round: 0, 
            curInit: 0, 
            started: false,
        }
        this._members = []
        this._membersData = {}
        this._membersConditions = {}

        // this._dbCombatList = null
        if (this._dbCurrentCombat) 
            this.off(this._dbCurrentCombat)
        this._dbCurrentCombat = null

        if (this._dbCurrentMembers) 
            this.off(this._dbCurrentMembers)
        this._dbCurrentMembers = null

        if (this._dbCurrentMembersData) 
            this.off(this._dbCurrentMembersData)
        this._dbCurrentMembersData = null

        if (this._dbCurrentMembersConditions) 
            this.off(this._dbCurrentMembersConditions)
        this._dbCurrentMembersConditions = null
    }

    loadCurrentCombat(gmid, partyid) {
        this.reset()

        this._gmid = gmid
        this._partyid = partyid
        this._dbCurrentCombat = this.ref(this.database, 'combat/' + gmid + '/' + partyid)
        this._dbCurrentMembers = this.ref(this.database, 'combatmembers/' + gmid + '/' + partyid)
        this._dbCurrentMembersData = this.ref(this.database, 'cmdata/' + gmid + '/' + partyid)
        this._dbCurrentMembersConditions = this.ref(this.database, 'cmconditions/' + gmid + '/' + partyid)

        this.onValue(this._dbCurrentCombat, (snapshot) => { this.getCombatOnValue(snapshot) })
        this.onValue(this._dbCurrentMembers, (snapshot) => { this.getMembersOnValue(snapshot) })
        this.onValue(this._dbCurrentMembersData, (snapshot) => { this.getMembersDataOnValue(snapshot) })
        this.onValue(this._dbCurrentMembersConditions, (snapshot) => { this.getMembersConditionsOnValue(snapshot) })
    }

    /* Data functions */

    getCombat() {
        return this._combat
    }

    getMembers() {
        return this._members
    }

    getMembersData() {
        return this._membersData
    }

    getMembersConditions() {
        return this._membersConditions
    }

    /* Combat functions */

    getCombatOnValue(snapshot) {
        const data = snapshot.val()
        // console.log("getCombatOnValue", data)
        if (data != null) {
            this._combat = data
        } else {
            this._combat = {
                round: 0, 
                curInit: 0, 
                started: false,
            }
        }

        this.emit('Combat')
    }
    /* Combat members functions */

    getMembersOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._members = data
        } else {
            this._members = []
        }

        this.emit('Members')
        // if (data != null) {
        //     parent.receiveMembers(data)

        //     // console.log(data)

        //     if (data != null) {
        //         Object.keys(data).forEach((i) => {
        //             if (!parent.selectedPartyMembers.includes(data[i].id)) {
        //                 parent.selectedPartyMembers.push(data[i].id)
        //             }
        //         })
        //     }

        // } else {
        //     parent.resetMembers()
        // }
    }

    /* Combat members data functions */

    getMembersDataOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._membersData = data
        } else {
            this._membersData = {}
        }

        this.emit('MembersData')
    }

    /* Combat members conditions functions */

    getMembersConditionsOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._membersConditions = data
        } else {
            this._membersConditions = {}
        }
        
        this.emit('MembersConditions')
    }

}

export default new CombatViewerService();