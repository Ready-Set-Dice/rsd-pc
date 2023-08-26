const express = require('express')
const { ProfileService, PCService } = require('../services')
const router = express.Router();
const { UserVerify } = require('../userverify')

router.use(UserVerify)

router.post('/new', (req,res) => {
  const origin = req.get('origin')

  const useruid = req.body.useruid
  const pcname = req.body.pcname
  const pclevel = req.body.pclevel
  const profile = ProfileService.getProfile(origin, useruid)
  
  const result = PCService.newPC(origin, useruid, pcname, pclevel, profile.restricted)

  res.send(result)
});

router.post('/delete', (req,res) => {
  const origin = req.get('origin')

  const useruid = req.body.useruid
  const pcid = req.body.pcid

  const result = PCService.deletePC(origin, useruid, pcid)

  res.send(result)
})

module.exports = router;