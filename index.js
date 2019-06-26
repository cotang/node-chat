const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = 8080;


// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// static files
app.use(express.static(__dirname + '/public'))




// Routing
// include routes
var routes = require('./routes/router');
app.use('/', routes);







app.listen(port, () => console.log(`Example app listening on port ${port}!`));

