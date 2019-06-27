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
app.use(express.static(__dirname + '/public'))




// Routing
// include routes
const routes = require('./routes/router');
app.use('/', routes);







app.listen(port, () => console.log(`Example app listening on port ${port}!`));

