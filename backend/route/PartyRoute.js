const express = require('express')
const { PartyService, PCService } = require('../services')
const router = express.Router();
const { UserVerify } = require('../userverify')

router.use(UserVerify)

router.post('/join', (req,res) => {
    const origin = req.get('origin')

    const useruid = req.body.useruid
    const pcid = req.body.pcid
    const gmid = req.body.gmid
    const partyid = req.body.partyid

    const result = PartyService.joinParty(origin, useruid, pcid, gmid, partyid)

    res.send(result)
})

router.post('/leave', (req,res) => {
    const origin = req.get('origin')

    const useruid = req.body.useruid
    const pcid = req.body.pcid
    const gmid = req.body.gmid
    const partyid = req.body.partyid

    const result = PartyService.leaveParty(origin, useruid, pcid, gmid, partyid)

    res.send(result)
})

module.exports = router;