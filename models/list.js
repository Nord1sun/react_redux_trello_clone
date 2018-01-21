'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    title: {
      type: DataTypes.STRING,
      defaultValue: 'Add list title...'
    },
    BoardId: DataTypes.INTEGER
  });

  List.prototype.getUser = async function() {
    const board = await this.getBoard();
    return await board.getUser();
  };

  return List;
};
