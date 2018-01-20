'use strict';
module.exports = (sequelize, DataTypes) => {
  var Card = sequelize.define('Card', {
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
