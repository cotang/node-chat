var express = require('express');
var router = express.Router();
const path = require('path');
// var User = require('../models/user');


/*
//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
      console.log('authenticate')
    // User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
    //   console.log('authenticate', error, user)
    //   if (error || !user) {
    //     var err = new Error('Wrong email or password.');
    //     err.status = 401;
    //     return next(err);
    //   } else {
    //     req.session.userId = user._id;
    //     return res.redirect('/profile');
    //   }
    // });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/profile', function (req, res, next) {
//   User.findById(req.session.userId)
//     .exec(function (error, user) {
//       if (error) {
//         return next(error);
//       } else {
//         if (user === null) {
//           var err = new Error('Not authorized! Go back!');
//           err.status = 400;
//           return next(err);
//         } else {
//           return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
//         }
//       }
//     });
});

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

*/


router.post('/login', 
//   (req, res, next) => {
//     if (req.body.title != ''){
//       next();
//     } else {
//       res.status(404).send('Validation error'); 
//     }
//   },
  (req, res, next) => {
    if (req.body.loginEmail && req.body.loginPassword) {
        console.log('authenticate')
    // User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
    //   console.log('authenticate', error, user)
    //   if (error || !user) {
    //     var err = new Error('Wrong email or password.');
    //     err.status = 401;
    //     return next(err);
    //   } else {
    //     req.session.userId = user._id;
    //     return res.redirect('/profile');
    //   }
    // });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }




    // const todoitem = {
    //   key: Date.now(),
    //   title: req.body.title,
    //   completed: false
    // }
    // // read data
    // fs.readFile('public/todo.json', 'utf8', function (err, data) {
    //   if (err) throw err;
    //   let todolist = JSON.parse(data);
    //   // add data
    //   todolist.push(todoitem);
    //   // write data
    //   fs.writeFile('public/todo.json', JSON.stringify(todolist, null, '\t'), function (err) {
    //     if (err) throw err;
    //     // console.log(JSON.stringify(todolist))
    //   });
    //   res.json(todolist);
    // });   
  }
);


router.post('/register',
    (req, res, next) => {
        if (req.body.registerEmail && req.body.registerPassword) {
            var userData = {
                email: req.body.email,
                password: req.body.password
              }
          
              User.create(userData, function (error, user) {
                if (error) {
                  return next(error);
                } else {
                  req.session.userId = user._id;
                  return res.redirect('/profile');
                }
              });
        } else {
            console.log('unreachable case until all fields in form are required')
            // var err = new Error('All fields required.');
            // err.status = 400;
            // return next(err);
        }
    }
);










router.get('/login', (req, res) => 
    res.sendFile(path.join(__dirname, '../public', 'login.html'))
);
router.get('/register', (req, res) => 
    res.sendFile(path.join(__dirname, '../public', 'register.html'))
);
router.get('/lobby', (req, res) => 
    res.sendFile(path.join(__dirname, '../public', 'lobby.html'))
);
router.get('/room', (req, res) => 
    res.sendFile(path.join(__dirname, '../public', 'room.html'))
);
router.get('/',function(req,res){
    res.redirect('/login');
});
router.get('*',function(req,res){
    res.send('<p>Error! Go back to <a href="/login">homepage</a>.</p>');
});



module.exports = router;