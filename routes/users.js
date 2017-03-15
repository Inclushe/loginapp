var express = require('express')

// https://expressjs.com/en/4x/api.html#router
var router = express.Router()

// https://github.com/jaredhanson/passport/blob/master/README.md
var passport = require('passport')

// https://www.npmjs.com/package/passport-local
var LocalStrategy = require('passport-local').Strategy

var User = require('../models/user')

router.get('/register', function (req, res) {
  res.render('register')
})
router.post('/register', function (req, res) {
  // Validation
  // https://github.com/ctavan/express-validator#reqcheck
  req.checkBody('name', `Name is required`).notEmpty()
  req.checkBody('username', `Username is required`).notEmpty()
  req.checkBody('email', `Email is required`).notEmpty()
  req.checkBody('email', `Email is not valid`).isEmail()
  req.checkBody('password', `Password is required`).notEmpty()
  req.checkBody('password2', `Passwords do not match`)
    .equals(req.body.password)

  // https://github.com/ctavan/express-validator#usage
  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      // If there are errors, send them to the user.
      res.render('register', {
        errors: result.array()
      })
    } else {
      // If there are no errors, create a user.
      var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      })

      User.createUser(newUser, function (err, user) {
        if (err) throw err
        console.log(user)
      })

      req.flash('success_msg', 'You are registered and can now login.')
      res.redirect('/users/login')
    }
  })
})
router.get('/login', function (req, res) {
  res.render('login')
})

// http://www.passportjs.org/docs/username-password
passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      if (err) throw err
      if (!user) {
        return done(null, false, {message: 'Unknown User'})
      }

      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, {message: 'Invalid password'})
        }
      })
    })
  }
))

// http://www.passportjs.org/docs#sessions
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user)
  })
})

// http://www.passportjs.org/docs/authenticate
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }), function (req, res) {
    res.redirect('/')
})

router.get('/logout', function (req, res) {
  req.logout()
  req.flash('success_msg', 'Successfully logged out.')
  res.redirect('/users/login')
})

module.exports = router
