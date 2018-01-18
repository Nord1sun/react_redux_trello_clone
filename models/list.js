'use strict';
module.exports = (sequelize, DataTypes) => {
  var List = sequelize.define('List', {
    title: {
      type: DataTypes.STRING,
      defaultValue: 'Add list title...'
    },

    description: {
      type: DataTypes.STRING,
      defaultValue: 'Add list description...'
    },

    BoardId: DataTypes.INTEGER
  });
  return List;
};
