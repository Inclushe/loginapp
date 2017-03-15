var express = require('express')
// https://expressjs.com/en/4x/api.html#router
var router = express.Router()

router.get('/register', function (req, res) {
  res.render('register')
})
router.get('/login', function (req, res) {
  res.render('login')
})

module.exports = router
