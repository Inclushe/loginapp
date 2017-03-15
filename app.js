// http://npmjs.com/package/express
var express = require('express')

// https://nodejs.org/api/path.html
var path = require('path')

// https://www.npmjs.com/package/body-parser
var bodyParser = require('body-parser')

// https://www.npmjs.com/package/cookie-parser
var cookieParser = require('cookie-parser')

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

/*
  Connect to the local MongoDB server.
  The login database is automatically created if not already created.
*/
mongoose.connect('mongodb://localhost/loginapp')

// mongoose.connection allows us to attach events
var db = mongoose.connection

// Routes are passed into separate files.
var routes = require('./routes/index.js')
var users = require('./routes/users.js')

// Initialize Express
var app = express()

// View Engine

/*
  Sets the application's directories for rendering files.
  It will automatically append that directory to res.render(file).
*/
app.set('views', path.join(__dirname, 'views'))

/*
  Allows Express to render Handlebars formatted HTML.
  Express will still accept plain HTML.
*/
app.engine('handlebars', exphbs({defaultLayout: 'layout'}))
app.set('view engine', 'handlebars')

// BodyParser Middleware

/*
  Middleware intercepts certain filetypes and runs
  functions for better functionality in Express.

  Learn more here: https://expressjs.com/en/guide/using-middleware.html
*/

// bodyParser.json() parses JSON files.
app.use(bodyParser.json())
// bodyParser.urlencoded() parses form data.
app.use(bodyParser.urlencoded({extended: false}))
// cookieParser parses cookies and provides easy access to a request's cookies.
app.use(cookieParser())

// Set folder for static (unchanging) files.
app.use(express.static(path.join(__dirname, 'public')))

// Enables sessions to be used in Express.
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

// Gives authentication to app with persistent logins
app.use(passport.initialize())
app.use(passport.session())

// Displays errors to the user via the response.
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

// Displays messages to the user via the response.
app.use(flash())

// Defines global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

/*
  When the user goes to these paths, the program
  uses the files in the routes directory.
*/
app.use('/', routes)
app.use('/users', users)

// Sets the port of the application.
app.set('port', (process.env.PORT || 3000))

// Accepts requests on the port provided.
app.listen(app.get('port'), function () {
  console.log(`Server started on localhost:${app.get('port')}`)
})
