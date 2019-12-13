const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const port = 8100;
const app = express();
const MongoStore = require('connect-mongo')(session);
const Room = require('./models/room');

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
app.use(express.static('uploads'))

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

  //listen on set_username
  socket.on('set_username', name => socket.username = name)

  // join particular room 
  socket.on('join_room', function (room) {
    socket.join(room);

    //listen on new_message
    socket.on('new_message', (data) => {
      const messageData = {
        message: data.message,
        className: data.className,
        file: data.file,
        author: socket.username
      }
      // write to DB
      Room.findOneAndUpdate({ name: room },
        {
          $push: { "messages": messageData }
        },
        (error, message) => {
          //broadcast the new message
          nsp.to(room).emit('new_message', messageData);
        })
    })

    //listen on typing
    socket.on('typing', (data) => {
      socket.broadcast.to(room).emit('typing', { username: socket.username })
    })

  });
})
