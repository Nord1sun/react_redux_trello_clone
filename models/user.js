'use strict';
const bcrypt = require("bcrypt");
const md5 = require('md5');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Email cannot be empty'
        },
        isEmail: {
          msg: 'Email is invalid'
        }
      }
    },
    img: {
      type: DataTypes.STRING,
      defaultValue: '/user.png'
    },
    password: DataTypes.STRING,
    token: DataTypes.STRING
  });

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.hook('beforeCreate', (user) => {
    user.token = md5(`${ user.email }${ uuid() }`);
    user.password = bcrypt.hashSync(user.password, 8);
  });

  return User;
};
