const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/user');
const Room = require('../models/room');

// ПОСТЫ

router.post('/register',
  (req, res, next) => {
    if (req.body.registerEmail && req.body.registerPassword) {
      const userData = {
        email: req.body.registerEmail,
        password: req.body.registerPassword
      }
      User.create(userData, (error, user) => {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/lobby');
        }
      });
    } else {
      console.log('unreachable case until all fields in form have prop required')
    }
  }
);
router.post('/login',
  (req, res, next) => {
    if (req.body.loginEmail && req.body.loginPassword) {
      console.log('authenticate')
      User.authenticate(req.body.loginEmail, req.body.loginPassword, (error, user) => {
        console.log('authenticate', error, user, req.body.remember)
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          // if we don't remember ourselves - ?
          // if (!req.body.remember) { }
          req.session.userId = user._id;
          return res.redirect('/lobby');
        }
      });
    } else {
      console.log('unreachable case until all fields in form have prop required')
    }
  }
);

router.post('/lobby',
  (req, res, next) => {
    if (req.body.chatName) {
      // TODO change url to id (how to get readable id?)
      // const num = Room.find().length ? Room.findOne().sort({ _id: -1 }).where('id') + 1 : 1;
      const roomData = {
        name: req.body.chatName,
        url: req.body.url,
      }
      Room.create(roomData, (error, room) => {
        if (error) {
          return next(error);
        } else {
          Room.find().exec(function (err, rooms) {
            res.json(rooms)
          });
        }
      });
    }
  }
);




// ГЕТЫ

function authChecker(req, res, next) {
  User.findById(req.session.userId).exec((error, user) => {
    if (error) {
      return next(error);
    } else {
      if (user === null && (req.path === '/lobby' || req.path === '/room')) {
        res.redirect('/login');
      } else if (user && (req.path === '/login' || req.path === '/register')) {
        res.redirect('/lobby');
      } else {
        next()
      }
    }
  })
}

// GET for logout logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

router.get('/login', authChecker, (req, res) =>
  res.render('login')
);
router.get('/register', authChecker, (req, res) =>
  res.render('register')
);
router.get('/lobby', authChecker, (req, res) =>
  // TODO load users and rooms independently ?
  User.findById(req.session.userId).exec((error, user) => {
    if (!error && user !== null) {

      Room.find().exec(function (err, rooms) {
        res.render('lobby', { user, rooms })
      });
    }
  })
);
router.get('/room/:id', authChecker, (req, res) => {
  const url = String(req.params.id);
  User.findById(req.session.userId).exec((error, user) => {
    if (!error && user !== null) {

      // TODO limit shown entries
      Room.findOne({ name: url }).exec(function (err, room) {
        res.render('room', { user, url, messages: room.messages })
      });
    }
  })
});

router.get('/', (req, res) => {
  res.redirect('/lobby');
});
router.get('*', (req, res) => {
  res.send('<p>Wrong page! Go back to <a href="/lobby">main page</a>.</p>');
});

module.exports = router;