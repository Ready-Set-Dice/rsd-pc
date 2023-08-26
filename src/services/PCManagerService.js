const EventEmitter = require('events')

class PCManagerService extends EventEmitter {
    constructor() {
        super()
    }

    init(funcObj) {
        this.f = funcObj

        this.reset()

        this.autoSelect = false

        // console.log("PCManagerService init")
    }

    unload() {
        this.reset()
    }

    load() {
        const auth = this.f.getAuth()
        const curuser = auth.currentUser
        if (curuser) {
            // console.log(curuser)
            this.useruid = curuser.uid

            this._dbPCListRef = this.f.ref(this.f.database, 'pclist/' + this.useruid)
            this._dbCharDataRef = this.f.ref(this.f.database, 'chardata/' + this.useruid)
            this._dbPartyRef = null
            this._dbGMCDataRef = null
            this._dbMembersRef = {}

            this.f.onValue(this._dbPCListRef, (snapshot) => {this.onPCListValue(snapshot)})
            this.f.onValue(this._dbCharDataRef, (snapshot) => {this.onPCDataValue(snapshot)})
        }
    }

    reset() {
        this._pcList = {}
        this._pcData = {}
        this._partyObj = {}
        this._gmcData = {}
        this._gmid = null
        this._partyid = null

        if (this._dbPCListRef) 
            this.off(this._dbPCListRef)

        if (this._dbCharDataRef) 
            this.off(this._dbCharDataRef)

        this._resetPartyListeners()
    }

    /* Data reference setters */

    setPartyRef(gmid, partyid) {
        this._resetPartyListeners()

        if (!!gmid && !!partyid) {
            this._gmid = gmid
            this._partyid = partyid

            this._dbPartyRef = this.f.ref(this.f.database, 'partydata/' + this._gmid + '/' + this._partyid)
            this.f.onValue(this._dbPartyRef, (snapshot) => { this.getPartyOnValue(snapshot) })
        }
    }


    /* Data functions */

    getPCList() {
        return this._pcList
    }

    getGMCData() {
        return this._gmcData
    }

    getPCData() {
        return this._pcData
    }

    getParty() {
        return this._partyObj
    }

    getPartyMembers() {
        const party = this.getParty()
        return party ? this._partyMembers : null
    }

    /* Player characters list functions */

    onPCListValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._pcList = data
            // console.log("onPCListValue", data)

            // if (this.autoSelect) {
            //     this.updatePCActive(Object.keys(data.ids)[data.ids.length-1])
            //     this.autoSelect = false
            // }
        } else {
            this._pcList = {}
        }

        this.emit('PCList')
        this.loadParty()
    }

    onPCDataValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._pcData = data
        } else {
            this._pcData = {}
        }

        this.emit('PCData')
        this.loadParty()
    }

    updatePCActive(id) {
        if (!!id) {
            this.f.set(this.f.child(this._dbPCListRef, 'active'), id)
        }
    }

    updatePCData(pcid, data) {
        this.f.set(this.f.child(this._dbCharDataRef, pcid), data)
    }

    /* Player characters remote functions */

    addPlayerCharacter(options) {
        let pcCount = 0
        if (this._pcList && this._pcList.ids && this._pcList.ids.length > 0) {
            partyCount += this._pcList.ids.length
        }

        if (partyCount < 10 && this._pcList) {
            const newPCID = this.f.push(this._dbPCListRef)
            const newPCIDKey = newPCID.key

            let newPCList = null
            if (!!this._pcList.ids && this._pcList.ids.length > 0) {
                newPCList = {...this._pcList}
                newPCList.ids.push({[newPCIDKey]: true})
            } else {
                newPCList = {ids: []}
                newPCList.ids.push({[newPCIDKey]: true})
            }

            this.f.set(this._dbPCListRef, newPCList).then(() => {
                if (!newPCList.active) {
                    newPCList.active = newPCIDKey
                    this.f.set(this._dbPCListRef, newPCList)
                }

                this.f.set(this.f.child(this._dbCharDataRef, newPCIDKey), {
                    name: options.name,
                    level: options.level
                })
            })

        }

        // const data = {useruid: this.useruid, pcname: options.name, pclevel: options.level, secret: secret}

        // this.autoSelect = true

        // this.f.axios.post('https://'+this.f.subdomain+'.readysetdice.com/pc/new', data)
        // .then((response) => {
        //     // console.log("response ", response)
        //     // return response.data
        //     // if (response.data === 'PC_LIMIT') {
        //     //     parent.pcLimit = true
        //     //     setTimeout(()=>{parent.pcLimit = false}, 2000)
        //     // }
        //     // this.emit('addPlayerCharacter', name, response.data)
        // })
        // .catch((error) => {
        //     console.log(error)
        // })
    }

    deletePlayerCharacter(pcid, secret) {
        const data = {useruid: this.useruid, pcid: pcid, secret: secret}

        this.f.axios.post('https://'+this.f.subdomain+'.readysetdice.com/pc/delete', data)
        .then((response) => {
        })
        .catch((error) => {
            console.log(error)
        })
    }

    /* Party functions */

    loadParty() {
        if (this._pcList && this._pcList.active) {
            const active = this._pcList.active
    
            if (active && this._pcData && this._pcData[active]) {
                const gmid = this._pcData[active].gmid
                const partyid = this._pcData[active].partyid
                if (!!gmid && !!partyid) {
                    this.setPartyRef(gmid, partyid)
                } else {
                    this._resetPartyListeners()
                }
            }
        }
    }

    getPartyOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._partyObj = data

            // console.log("getPartyOnValue", data);
            if (data.members != null && Object.keys(data.members).length > 0) {
                let hasGMCs = false
                Object.keys(data.members).forEach((i) => {
                    if (data.members[i]) {
                        Object.keys(data.members[i]).forEach((j) => {
                            if (!!data.members[i][j] && data.members[i][j] === 'pc') {
                                this._dbMembersRef[j] = this.f.ref(this.f.database, 'pcdata/' + i + '/' + j + '/')
                                // console.log("player: ", 'playerdata/' + i + '/' + j + '/');
                
                                this.f.onValue(this._dbMembersRef[j], (snapshot) => {
                                    // console.log("onValue player: ", i, snapshot.key, snapshot.val())
                                    this.getMemberOnValue(snapshot)
                                })
                            } else if (!!data.members[i][j] && data.members[i][j] === 'gmc') {
                                hasGMCs = true
                            }
                        })
                    }

                    if (!!hasGMCs) {
                        this._dbGMCDataRef = this.f.ref(this.f.database, 'gmcdata/' + this._gmid + '/' + this._partyid)
                        this.f.onValue(this._dbGMCDataRef, (snapshot) => {this.getGMCDataOnValue(snapshot)})
                    }
                })
            }
        } else {
            this._partyObj = {}
        }

        this.emit('Party')
    }

    getMemberOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._partyMembers[snapshot.key] = data
        } else {
            if (this._partyMembers[snapshot.key]) {
                delete this._partyMembers[snapshot.key]
            }
        }

        this.emit('PartyMembers')

        // this.f.setPartyData(snapshot.key, data)
        // this._forcePartyMembersRefresh()
    }

    /* GMC functions */
    getGMCDataOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._gmcData = data
        } else {
            this._gmcData = {}
        }
        
        this.emit('GMCData')
    }

    /* Party remote functions */

    joinParty(secret, pcid, gmid, partyid) {
        const data = {useruid: this.useruid, secret: secret, pcid: pcid, gmid: gmid, partyid: partyid}

        this.f.axios.post('https://'+this.f.subdomain+'.readysetdice.com/party/join', data)
        .then((response) => {
            window.location.search = ''
            // console.log(response)
            // this.emit("PartyJoined")
            // if (response.data.slice(0,2) === 'OK') {
            //     parent.partyJoined = true
            //     parent.partyName = response.data.slice(3,response.data.length)
            //     setTimeout(()=>{parent.$router.replace('player-manager')}, 2000)
            // } else if (response.data === 'NO_PARTY') {
            //     parent.noParty = true
            //     setTimeout(()=>{parent.$router.replace('player-manager')}, 2000)
            // }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    leaveParty(secret, pcid, gmid, partyid) {
        // console.log(gmid, partyid)

        const data = {useruid: this.useruid, secret: secret, pcid: pcid, gmid: gmid, partyid: partyid}

        this.f.axios.post('https://'+this.f.subdomain+'.readysetdice.com/party/leave', data)
        .then((response) => {
            // console.log(response)
            // this.emit("PartyJoined")
            // console.log(response.data)
            
        })
        .catch((error) => {
            console.log(error)
        })
    }

    /* Test functions */

    getCondition() {
        this.f.axios.get('https://api.readysetdice.com/condition', {
            headers: {
                'Authorization': 'f356ec2e-9827-4e8f-8f67-4b744080ebbb'
            }
        })
        .then((response) => {
            // console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    /* Internal function */

    _resetPartyListeners() {
        this._partyMembers = {}
        this._partyObj = {}

        if (this._dbPartyRef) {
            this.off(this._dbPartyRef)
        }
        if (this._dbMembersRef && Object.keys(this._dbMembersRef).length > 0) {
            Object.keys(this._dbMembersRef).forEach((i) => {
                this.off(this._dbMembersRef[i])
            })
        }
        if (this._dbGMCDataRef) {
            this.off(this._dbGMCDataRef)
        }
    }

    _forcePartyMembersRefresh() {
        const oldval = this._partyMembers
        this._partyMembers = null
        this._partyMembers = ''
        this._partyMembers = oldval
    }
}

export default new PCManagerService();