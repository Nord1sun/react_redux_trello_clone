'use strict';
module.exports = (sequelize, DataTypes) => {
  var Card = sequelize.define('Card', {
    title: {
      type: DataTypes.STRING,
      defaultValue: 'Add card title...'
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: 'Add card description...'
    },
    completed: {
      type:DataTypes.BOOLEAN,
      defaultValue: false
    },
    ListId: DataTypes.INTEGER
  });
  return Card;
};
