const { ProfileService } = require('@/../../.shared/backend/ProfileService')
const { PCService } = require('@/../../.shared/backend/PCService')
const { PartyService } = require('@/../../.shared/backend/PartyService')

const subdomain = 'pc'

class ServiceManager {
    constructor() {

    }

    init(prodDB, devDB, selectDB) {
        ProfileService.init(prodDB, devDB, subdomain)
        PCService.init(prodDB, devDB, subdomain, selectDB)
        PartyService.init(prodDB, devDB, subdomain, selectDB)

        PartyService.setPCService(PCService)
        PCService.setPartyService(PartyService)
    }
}

module.exports.ServiceManager = new ServiceManager()

module.exports.ProfileService = ProfileService
module.exports.PCService = PCService
module.exports.PartyService = PartyService
module.exports.subdomain = subdomain