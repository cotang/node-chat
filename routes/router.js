const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/user');

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
router.post('/room',
  (req, res, next) => {
    if (req.body.chatName) {
      // Room.create(userData, (error, user) => {
      //   if (error) {
      //     return next(error);
      //   } else {
      //     req.session.userId = user._id;
      //     return res.redirect('/lobby');
      //   }
      // }); 
    }
    res.send('room created')
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
  User.findById(req.session.userId).exec((error, user) => {
    if (!error && user !== null) {
      res.render('lobby', { user })
    }
  })
);
router.get('/room/:id', authChecker, (req, res) => {
  const id = Number(req.params.id);
  User.findById(req.session.userId).exec((error, user) => {
    if (!error && user !== null) {
      res.render('room', { user, id })
    }
  })
});
// router.get('/room', authChecker, (req, res) => {
//   User.findById(req.session.userId).exec((error, user) => {
//     if (!error && user !== null) {
//       res.render('room', { user })
//     }
//   })
// });

router.get('/', (req, res) => {
  res.redirect('/lobby');
});
router.get('*', (req, res) => {
  res.send('<p>Wrong page! Go back to <a href="/lobby">main page</a>.</p>');
});

module.exports = router;
