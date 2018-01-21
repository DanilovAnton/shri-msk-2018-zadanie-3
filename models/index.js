'use strict';

/*
  Вынес конфигурацию базы данных в отдельный файл config.json
*/
const path = require('path');
const Sequelize = require('sequelize');

const config = require(path.join(__dirname, '/../config'))['production']['db'];

const scheme = require('./scheme');

const Op = Sequelize.Op;

/*
  Переменные должны отличатся не только регистром символов,
  лучше дать уникальное название отображающее назначение данной переменной
  Необходимо указать схему в базе данных
*/
const connection = new Sequelize(
  config.name,
  config.username,
  config.password,
  {
    dialect: config.dialect,
    storage: config.storage,
    operatorsAliases: {
      $and: Op.and,
      $or: Op.or,
      $eq: Op.eq,
      $in: Op.in,
      $gte: Op.gte,
      $lte: Op.lte
    }, // Проверить перечень псевдонимов необходимых приложению
    logging: true // Временно включил логи для отладки
  }
);

scheme(connection);
connection.sync().catch(function (error) {
  console.log(error); // Если возникнет ошибка выводим ее в консоль
});

module.exports.sequelize = connection;
module.exports.models = connection.models;
