'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // Добавил moragan для логирования

const graphqlRoutes = require('./graphql/routes');

const app = express();

app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
);

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/graphql', graphqlRoutes); // Ошибка в названии маршрута заданно graphgl, а нужно graphql

app.all('*', function (req, res) {
  console.log(req.url);
  res.sendFile(path.resolve(path.join(__dirname, 'public'), 'index.html'));
});

app.listen(3000, () => console.log('Express app listening on localhost:3000'));
