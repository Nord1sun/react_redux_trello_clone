'use strict';
module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    action: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    CardId: DataTypes.INTEGER
  });
  return Event;
};
