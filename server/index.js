const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var saltRounds = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", saltRounds);

var db = require('./database');

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());

// Register created API
app.use('/api/users', require('./api/users'));
// Register openbids
app.use('/api/openQ_bids', require('./api/openQ_bids'));

// Expres will listen to the port and handle the request
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

db.query('SELECT NOW()', (err, res) => {
  if(err.error)
    return console.log(err.error);
  console.log(`PostgreSQL connected: ${res[0].now}`); // Timestamp when connected
});

module.exports = app;
