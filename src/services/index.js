import rtdb from "../rtdb"
import { getAuth } from 'firebase/auth'
import { child, ref, set, onValue, onChildAdded, onChildChanged, onChildRemoved , off, update, push, remove } from 'firebase/database'
import axios from 'axios'

const dev = process.env.NODE_ENV !== "development" ? false : true
const subdomain = !!dev ? 'localhost:9092' : 'pc'

const isGM = false
const EncounterBuilderService = null

import CombatViewerService from "./CombatViewerService"
// import PCManagerService from "./PCManagerService"

import APIService from "@root/.shared/services/APIService"
import PCBuilderService from "@/services/PCBuilderService"
import ProfileManagerService from "@root/.shared/services/ProfileManagerService"
import CampaignService from "@root/.shared/services/CampaignService"
import CombatService from "@root/.shared/services/CombatService"

import ActionService from "@root/.shared/db/ActionService"
import AncestryService from "@root/.shared/db/AncestryService/AncestryService"
// import ArcheTypeService from "@root/.shared/db/ArcheTypeService"
import BackgroundService from "@root/.shared/db/BackgroundService"
import BestiaryService from "@root/.shared/db/BestiaryService/BestiaryService"
import ClassService from "@root/.shared/db/ClassService/ClassService"
import DeityService from "@root/.shared/db/DeityService"
import FeatService from "@root/.shared/db/FeatService"
import HeritageService from "@root/.shared/db/HeritageService"
import SpellService from "@root/.shared/db/SpellService/SpellService"
import StaticService from "@root/.shared/db/StaticService"

const ServiceManager = {
    constructor() {
        this._initialized = false
        this._loaded = false
    },

    init(store) {
        let funcObj = {
            dev: dev,
            database: rtdb, 
            getAuth: getAuth, 
            child: child, 
            ref: ref, 
            set: set, 
            push: push, 
            remove: remove, 
            off: off, 
            onValue: onValue,
            subdomain: subdomain, 
            axios: axios,
            logError: (e) => { console.error(e) },
            retrySet: (name, db, data, callback = null, tries = 0) => {
                if (!!db && tries < 3) {
                    set(db, data)
                    .then(() => {
                        if (!!callback) {
                            callback(true)
                        }
                    })
                    .catch((e) => {
                        console.log(`Failed to update ${name}, retry attempt [${tries}]`, data)
                        tries+=1
                        setTimeout(() => { funcObj.retrySet(name, db, data, callback, tries) }, 100)
                    })
                } else {
                    console.log(`Failed to do ${name}, maximum retries reached.`)
                    if (!!callback) {
                        callback(false)
                    }
                }
            },
            retryRemove: (name, db, callback = null, tries = 0) => {
                if (!!db && tries < 10) {
                    remove(db)
                    .then(() => {
                        if (!!callback) {
                            callback(true)
                        }
                    })
                    .catch((e) => {
                        console.log(`Failed to update ${name}, retry attempt [${tries}]`)
                        tries+=1
                        setTimeout(() => { funcObj.retryRemove(name, db, callback, tries) }, 100)
                    })
                } else {
                    console.log(`Failed to do ${name}, maximum retries reached.`)
                    if (!!callback) {
                        callback(false)
                    }
                }
            },
        }

        APIService.init(axios, store, dev)
        ProfileManagerService.init(funcObj)
        // PCManagerService.init(funcObj)
        CampaignService.init(funcObj, isGM, store)
        CombatViewerService.init(rtdb, getAuth, ref, off, onValue)
        CombatService.init(funcObj, isGM, store)
        PCBuilderService.init(rtdb, getAuth, child, ref, set, off, push, remove, update, onChildAdded, onChildChanged, onChildRemoved)
        
        AncestryService.init(store)
        ClassService.init(store)
        SpellService.init(store, StaticService)

        APIService.on("ActionSet", () => {
            ActionService.init(store)
        })

        APIService.on("AncestrySet", () => {
            AncestryService.loadAncestries()
        })

        APIService.on("AncestryFeatureSet", () => {
            AncestryService.loadAncestryFeatures()
        })

        // APIService.on("ArchetypeSet", () => {
        //     ArcheTypeService.init(store)
        // })

        APIService.on("BackgroundSet", () => {
            BackgroundService.init(store)
        })

        APIService.on("BestiarySet", () => {
            BestiaryService.init(store, SpellService, StaticService)
        })

        APIService.on("ClassSet", () => {
            ClassService.loadClasses()
        })

        APIService.on("ClassExtenedSet", () => {
            ClassService.loadClassesExtended()
        })

        APIService.on("ClassFeatureSet", () => {
            ClassService.loadClassFeatures()
        })

        APIService.on("DeitySet", () => {
            DeityService.init(store)
        })

        APIService.on("FeatSet", () => {
            FeatService.init(store)
        })

        APIService.on("HeritageSet", () => {
            HeritageService.init(store)
        })

        APIService.on("SpellSet", () => {
            SpellService.loadSpells()
        })

        APIService.on("SpellEffectSet", () => {
            SpellService.loadEffects()
        })

        APIService.on("StaticSet", () => {
            StaticService.load()
        })

        CampaignService.on('SetParty', (party) => {
            if (!!party && !!party.gmid) {
                CombatService.loadCurrentCombat(party.partyid, party.gmid)
            }
        })

        this._initialized = true

        if (!!dev) {
            console.log('Services initialized')
        }
    },

    load() {
        ProfileManagerService.load()
        // PCManagerService.load()
        CampaignService.load()
        CombatViewerService.load()
        CombatService.load()
        PCBuilderService.load()

        this._loaded = true

        if (!!dev) {
            console.log('Services loaded')
        }
    },

    unload() {
        ProfileManagerService.unload()
        // PCManagerService.unload()
        CampaignService.unload()
        CombatViewerService.unload()
        CombatService.unload()
        PCBuilderService.unload()

        this._loaded = false

        if (!!dev) {
            console.log('Services unloaded')
        }
    },

    initialized() {
        return this._initialized
    },

    loaded() {
        return this._loaded
    },
}

export default ServiceManager
export {ServiceManager as ServiceManager}

export {CombatViewerService as CombatViewerService}
export {CombatService as CombatService}
export {ProfileManagerService as ProfileManagerService}

export {APIService as APIService}
export {PCBuilderService as PCBuilderService}
// export {PCManagerService as PCManagerService}
export {CampaignService as PartyService}
export {CampaignService as CampaignService}
export {isGM as isGM}

export {EncounterBuilderService as EncounterBuilderService}

export {ActionService as ActionService}
export {AncestryService as AncestryService}
// export {ArcheTypeService as ArcheTypeService}
export {BackgroundService as BackgroundService}
export {BestiaryService as BestiaryService}
export {ClassService as ClassService}
export {DeityService as DeityService}
export {FeatService as FeatService}
export {HeritageService as HeritageService}
export {SpellService as SpellService}
export {StaticService as StaticService}

export {subdomain as subdomain}