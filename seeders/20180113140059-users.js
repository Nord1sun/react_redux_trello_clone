const models = require('./../models');
const User = models.User;
const md5 = require('md5');
const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface) => {
    const globalPassword = '$2a$08$7e0QZksAKX1lQft9/37nkuakp/Mlku93JfkA6Adedfm.4cM1MeswS';

    var users = [{
      fullName: 'John Doe',
      email: 'jdoe@example.com',
      password: globalPassword,
      token: md5(`jdoe@example.com${ uuid() }`)
    }];

    for (var i = 0; i < 2; i++) {
      users.push({
        fullName: `Foo${i} Bar${i}`,
        email: `foobar${i}@example.com`,
        password: globalPassword,
        token: md5(`foobar${i}@example.com${ uuid() }`)
      });
    }

    return queryInterface.bulkInsert('Users', users);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {}, User);
  }
};
