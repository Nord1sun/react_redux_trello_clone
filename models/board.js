'use strict';
module.exports = (sequelize, DataTypes) => {
  var Board = sequelize.define('Board', {
    title: {
      type: DataTypes.STRING,
      defaultValue: 'Add board title...'
    },

    UserId: DataTypes.INTEGER
  });

  return Board;
};
