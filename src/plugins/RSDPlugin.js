import {BestiaryController} from '@root/.shared/controllers/BestiaryController'
import {BottomSheetController} from '@root/.shared/controllers/BottomSheetController'
import {BuildController} from '@root/.shared/controllers/BuildController'
import {CampaignsController} from '@root/.shared/controllers/CampaignsController'
import {CombatController} from '@root/.shared/controllers/CombatController'
import {ConditionsController} from '@root/.shared/controllers/ConditionsController'
import {DialogController} from '@root/.shared/controllers/DialogController'
import {FormatController} from '@root/.shared/controllers/FormatController'
import {MembersController} from '@root/.shared/controllers/MembersController'
import {PlayerCharacterController} from '@root/.shared/controllers/PlayerCharacterController'
import {SettingsController} from '@root/.shared/controllers/SettingsController'
import {SpellsController} from '@root/.shared/controllers/SpellsController'
import {StaticController} from '@root/.shared/controllers/StaticController'
import {RandomController} from '@root/.shared/controllers/RandomController'
const isDev = process.env.NODE_ENV !== "development" ? false : true

export const $rsd = {
    bestiary: new BestiaryController(isDev),
    bottomsheet: new BottomSheetController(isDev),
    build: new BuildController(isDev),
    campaigns: new CampaignsController(isDev),
    combat: new CombatController(isDev),
    conditions: new ConditionsController(isDev),
    dialog: new DialogController(isDev),
    format: new FormatController(isDev),
    members: new MembersController(isDev),
    playercharacters: new PlayerCharacterController(isDev),
    settings: new SettingsController(isDev),
    spells: new SpellsController(isDev),
    static: new StaticController(isDev),
    random: new RandomController(isDev),
}

Object.values($rsd).forEach(controller => {
    controller.setFB($rsd)
})

// $rsd.campaigns.on('LoadActiveCampaign', handleLoadActiveCampaign)

// function handleLoadActiveCampaign(partyid) {
//     // console.log('Active campaign id', active)

//     console.log("test", $rsd)

//     if (!!$rsd.combat && !!$rsd.combat.setActive) {
//         $rsd.combat.setActive(partyid)

//         console.log('test',$rsd.combat)
//     }

//     // if (!!this.Combat && !!this.Combat.load && !!this.Combat.load.this) {
//     //     this.Combat.load.this(this.m_PartyList.active)
//     // }
    
//     // if (!!this.EncounterList && !!this.EncounterList.set && !!this.EncounterList.set.list) {
//     //     this.EncounterList.set.list(this.m_PartyList.active)
//     // }
// }