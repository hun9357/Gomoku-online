'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite'
});

// import models
const User = sequelize.import("./users.js");

module.exports = {
  User
};