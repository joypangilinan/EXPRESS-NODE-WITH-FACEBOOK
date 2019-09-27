var express = require('express');
const bodyParser = require('body-parser')
var User = require('../models/user')
var passport = require('passport')
var authenticate = require('../authenticate')
const cors = require('./cors')

var router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', cors.cors, function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {

      if (err) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.json({ err: err })
      } else {
        if (req.body.firstname)
          user.firstname = req.body.firstname
        if (req.body.lastname)
          user.lastname = req.body.lastname
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.json({ err: err })
            return
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({ success: true, token: token, status: 'Registration successful' })
          })
        })

      }
    })
})

router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({ _id: req.user._id })
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.json({ success: true, token: token, status: 'Your are successfully login' })
})

router.get('/logout', cors.cors, (req, res, next) => {
  req.logOut()
  res.redirect('/')
  // if (req.session) {
  //   req.session.destroy()
  //   //req.session.cookie.expires = new Date().getTime();
  //   res.clearCookie('session-id')
  //   res.end('Successfull logout')
  // } else {
  //   var err = new Error('You are not login!')
  //   err.status = 403
  //   next(err)
  // }
})

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  ('facebook-token'), (req, res) => {
    if (req.user) {
      var token = authenticate.getToken({ _id: req.user._id })
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json({ success: true, token: token, status: 'Your are successfully login' })
    }
  }
})

module.exports = router;
