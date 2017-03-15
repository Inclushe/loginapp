// http://npmjs.com/package/express
var express = require('express')

// https://nodejs.org/api/path.html
var path = require('path')

// https://www.npmjs.com/package/cookie-parser
var cookieParser = require('cookie-parser')

// https://www.npmjs.com/package/body-parser
var bodyParser = require('body-parser')

// https://www.npmjs.com/package/express-handlebars
var exphbs = require('express-handlebars')

// https://www.npmjs.com/package/express-validator
var expressValidator = require('express-validator')

// https://www.npmjs.com/package/connect-flash
var flash = require('connect-flash')

// https://www.npmjs.com/package/express-session
var session = require('express-session')

// https://github.com/jaredhanson/passport/blob/master/README.md
var passport = require('passport')

// https://www.npmjs.com/package/passport-local
var LocalStrategy = require('passport-local').Strategy

// https://www.npmjs.com/package/mongodb
var mongo = require('mongodb')

// https://www.npmjs.com/package/mongoose
var mongoose = require('mongoose')

// A MongoDB server must be running on localhost.
// You can download MongoDB from https://www.mongodb.com/download-center
mongoose.connect('mongodb://localhost/loginapp')

var db = mongoose.connection

// Routes
var routes = require('./routes/index.js')
var users = require('./routes/users.js')

// Init App
var app = express()

// View Engine
app.engine('handlebars', exphbs({defaultLayout: 'layout'}))
app.set('view engine', 'handlebars')

// BodyParser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

// Passport Init
app.use(passport.initialize())
app.use(passport.session())

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
    var root = namespace.shift()
    var formParam = root

    while (namespace.length) {
      formParam += `[${namespace.shift()}]`
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

// Connect flash
app.use(flash())

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

app.use('/', routes)
app.use('/users', users)

// Set port
app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), function () {
  console.log(`Server started on port ${app.get('port')}`)
})