'use strict'

var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  res.send({
    name: req.get('sm_user') || req.get('smgov_userdisplayname') || 'my friend',
    headers: req.headers
  })
})

module.exports = router
