const models = require('./../models');
const User = models.User;
const md5 = require('md5');
const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface) => {

    var users = [{
      fullName: 'Aaron Saloff',
      email: 'asaloff@example.com',
      password: '$2a$08$7e0QZksAKX1lQft9/37nkuakp/Mlku93JfkA6Adedfm.4cM1MeswS',
      token: md5(`asaloff@example.com${ uuid() }`)
    }];

    return queryInterface.bulkInsert('Users', users);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {}, User);
  }
};
