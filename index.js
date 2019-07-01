const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8100;
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://localhost/testNode');
const db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

// set the view engine to ejs
app.set('view engine', 'ejs');

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));
// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// static files
app.use(express.static('public'))

// Routing
// include routes
const routes = require('./routes/router');
app.use('/', routes);

const server = app.listen(port, () => console.log(`Node app listening on port ${port}!`));




//socket.io instantiation
const io = require("socket.io")(server)

//listen on connection 'my-namespace'
const nsp = io.of('/my-namespace');
nsp.on('connection', (socket) => {

  // Join particular room 
  socket.on('create', function (room) {
    socket.join(room);

    // TODO - перенести изначальное определение юзера на бэкенд
    //listen on change_username
    socket.on('change_username', (data) => {
      socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
      //broadcast the new message
      nsp.to(room).emit('new_message', { message: data.message, className: data.className, username: socket.username });
    })


    //listen on typing
    socket.on('typing', (data) => {
      socket.broadcast.to(room).emit('typing', { username: socket.username })
    })

  });
})
