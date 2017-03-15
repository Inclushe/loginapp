var express = require('express')
// https://expressjs.com/en/4x/api.html#router
var router = express.Router()

router.get('/', function (req, res) {
  res.render('index')
})

module.exports = router
