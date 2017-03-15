var mongoose = require('mongoose')
// Avoiding deprecation notice
mongoose.Promise = global.Promise
var bcrypt = require('bcryptjs')

// A schema defines the attributes of a collection.
// http://mongoosejs.com/docs/guide.html
var userSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  }
})

// http://mongoosejs.com/docs/models.html
var User = mongoose.model('User', userSchema)
module.exports = User

// https://www.npmjs.com/package/bcryptjs#usage---async
module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) throw err
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      if (err) throw err
      newUser.password = hash
      newUser.save(callback)
    })
  })
}

module.exports.getUserByUsername = function (username, callback) {
  User.findOne({username: username}, callback)
}
module.exports.getUserById = function (id, callback) {
  User.findById(id, callback)
}

// https://www.npmjs.com/package/bcryptjs#usage---async
module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err
    callback(null, isMatch)
  })
}
