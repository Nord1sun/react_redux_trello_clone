require('es6-promise').polyfill();
require('isomorphic-fetch');
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const sessions = require('./routers/sessions');
const boards = require('./routers/boards');
const lists = require('./routers/lists');
const cards = require('./routers/cards');

app.use('/api/v1/sessions', sessions);
app.use('/api/v1/boards', boards);
app.use('/api/v1/lists', lists);
app.use('/api/v1/cards', cards);


const errorHandler = (err, req, res, next) => {
  res.status(err.response ? err.response.status : 500);
  res.json(err.response);
  next();
};

app.use(errorHandler);

app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});

module.exports = app;
