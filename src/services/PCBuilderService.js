const EventEmitter = require('events')

class PCBuilderService extends EventEmitter {
    constructor() {
        super()
    }

    init(database, getAuth, child, ref, set, off, push, remove, update, onChildAdded, onChildChanged, onChildRemoved) {
        this.database = database
        this.getAuth = getAuth

        this.child = child
        this.ref = ref
        this.set = set
        this.off = off
        this.push = push
        this.remove = remove
        this.update = update

        this.onChildAdded = onChildAdded
        this.onChildChanged = onChildChanged
        this.onChildRemoved = onChildRemoved

        this.reset()

        this.autoSelect = false

        // console.log("PCManagerService init")
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

            this._dbPCBuildRef = null
        }
    }

    reset() {
        this._pcid = ''
        this._pcBuild = {}

        if (this._dbPCBuildRef) 
            this.off(this._dbPCBuildRef)
        this._dbPCBuildRef = null
    }

    /* Data reference setters */

    setPCBuildRef(pcid) {
        this.reset()
        this._pcid = pcid
        this._dbPCBuildRef = this.ref(this.database, 'pcbuild/' + this.useruid + '/' + this._pcid)
        // this.onValue(this._dbPCBuildRef, (snapshot) => {this.onPCClassValue(snapshot)})
        this.onChildAdded(this._dbPCBuildRef, (snapshot) => {this.onPCBuildChildAdded(snapshot)})
        this.onChildChanged(this._dbPCBuildRef, (snapshot) => {this.onPCBuildChildChanged(snapshot)})
        this.onChildRemoved(this._dbPCBuildRef, (snapshot) => {this.onPCBuildChildRemoved(snapshot)})
    }

    /* Data functions */

    getPCBuild() {
        return {...this._pcBuild}
    }

    /* Player characters list functions */
    onPCBuildChildAdded(snapshot) {
        const data = snapshot.val()
        this._pcBuild[snapshot.key] = data

        this.emit('PCBuild')
    }

    onPCBuildChildChanged(snapshot) {
        const data = snapshot.val()
        this._pcBuild[snapshot.key] = data

        this.emit('PCBuild')
    }

    onPCBuildChildRemoved(snapshot) {
        if (this._pcBuild[snapshot.key]) {
            delete this._pcBuild[snapshot.key]
        }
        this.emit('PCBuild')
    }

    resetBuild() {
        this.remove(this._dbPCBuildRef)
    }

    resetAncestry() {
        Object.keys(this._pcBuild).forEach(key => {
            if (this._pcBuild[key] && this._pcBuild[key].type) {
                switch(this._pcBuild[key].type) {
                    case 'ancestry-feat':
                    case 'heritage':
                        this.remove(this.child(this._dbPCBuildRef, key))
                        break;
                }
            }
        })
    }

    resetClass() {
        Object.keys(this._pcBuild).forEach(key => {
            if (this._pcBuild[key] && this._pcBuild[key].type) {
                switch(this._pcBuild[key].type) {
                    case 'class-feat':
                    case 'feat-choice':
                        this.remove(this.child(this._dbPCBuildRef, key))
                        break;
                    case 'setup-abilities':
                        this.update(this.child(this._dbPCBuildRef, key + '/bst'), {cls: ''})
                        break;
                }
            }
        })
    }

    addPCBuildItem(item) {
        switch(item.type) {
            case 'ancestry-feat':
                this._addAncestryFeat(item)
                break;
            case 'class-feat':
                this._addClassFeat(item)
                break;
            case 'feat-choice':
                this._addFeatChoice(item)
                break;
            case 'heritage':
                this._addHertitage(item)
                break;
            case 'setup':
                this._addSetup(item)
                break;
            case 'setup-abilities':
                this._addSetupAbilities(item)
                break;
            case 'skills':
                this._addSkills(item)
                break;
        }
    }

    /* Specific items handler functions */
    _addAbilities(item) {
        
    }

    _addAncestryFeat(item) {
        this._defaultAddLevelItem(item)
    }

    _addClassFeat(item) {
        this._defaultAddLevelItem(item)
    }

    _addClassSkills(item) {

    }

    _addFeatChoice(item) {
        this._defaultAddItem(item)
    }

    _addGeneralFeat(item) {

    }

    _addHertitage(item) {
        this._defaultAddItem(item)
    }

    // For optional rules and stuff (ex: free archetype)
    _addOptions(item) {
        
    }

    _addSetup(item) {
        this._defaultAddItem(item)
    }

    _addSetupAbilities(item) {
        this._defaultAddItem(item)
    }

    _addSkills(item) {
        this._defaultAddLevelItem(item)
    }

    _addSkillFeat(item) {
        
    }

    _defaultAddItem(item) {
        const found = this.findBuildItem({type: item.type})
        
        if (found.key) {
            this.update(this.child(this._dbPCBuildRef, found.key), item)
        } else {
            const newRef = this.push(this._dbPCBuildRef)
            this.set(newRef, item)
        }
    }

    _defaultAddLevelItem(item) {
        const found = this.findBuildItem({type: item.type, level: item.level})
        
        if (found.key) {
            this.update(this.child(this._dbPCBuildRef, found.key), item)
        } else {
            const newRef = this.push(this._dbPCBuildRef)
            this.set(newRef, item)
        }
    }

    /* Search function */
    findBuildItem(fObj) {
        let rObj = {key: null, value: null}

        let matches = Object.keys(this._pcBuild).filter(i => {
            // If filter has a type && the current item type doenst match
            if (fObj.type && this._pcBuild[i].type != fObj.type) {
                return false
            }
            // If filter has a level && the current item level doenst match
            if (fObj.level && this._pcBuild[i].level && this._pcBuild[i].level != fObj.level) {
                return false
            }
            // If everything is fine return true
            return true
        })

        if (matches && matches.length > 0) {
            rObj.key = matches[0]
            rObj.value = this._pcBuild[matches[0]]
        }
        return rObj
    }

}

export default new PCBuilderService();