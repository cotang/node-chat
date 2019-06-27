const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/user');

router.post('/register',
  (req, res, next) => {
    if (req.body.registerEmail && req.body.registerPassword) {
      const userData = {
        email: req.body.registerEmail,
        password: req.body.registerPassword
      }
      User.create(userData, function (error, user) {
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
      User.authenticate(req.body.loginEmail, req.body.loginPassword, function (error, user) {
        console.log('authenticate', error, user, req.body.remember)
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          if (req.body.remember) {
            req.session.userId = user._id;
            console.log('req.session', req.session)
          }
          return res.redirect('/lobby');
        }
      });
    } else {
      console.log('unreachable case until all fields in form have prop required')
    }
  }
);



// ГЕТЫ

function authChecker(req, res, next) {
  User.findById(req.session.userId).exec(function (error, user) {
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
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET get credentials at lobby page (todo:move to lobby)
router.get('/profile', (req, res, next) =>
  User.findById(req.session.userId).exec(function (error, user) {
    if (!error && user !== null) {
      res.send(user)
    }
  })
);

router.get('/login', authChecker, (req, res) =>
  res.sendFile(path.join(__dirname, '../public', 'login.html'))
);
router.get('/register', authChecker, (req, res) =>
  res.sendFile(path.join(__dirname, '../public', 'register.html'))
);
router.get('/lobby', authChecker, (req, res, next) =>
  res.sendFile(path.join(__dirname, '../public', 'lobby.html'))
);
router.get('/room', authChecker, (req, res) =>
  res.sendFile(path.join(__dirname, '../public', 'room.html'))
);

router.get('/', function (req, res) {
  res.redirect('/lobby');
});
router.get('*', function (req, res) {
  res.send('<p>Wrong page! Go back to <a href="/lobby">main page</a>.</p>');
});

module.exports = router;
