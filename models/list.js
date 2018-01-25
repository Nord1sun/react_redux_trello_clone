'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    title: {
      type: DataTypes.STRING,
      defaultValue: 'Add list title...'
    },
    BoardId: DataTypes.INTEGER,
    orderNum: DataTypes.INTEGER
  });

  List.prototype.getUser = async function() {
    const board = await this.getBoard();
    return await board.getUser();
  };

  List.hook('beforeValidate', async (list) => {
    try {
      const board = await sequelize.models.Board.findById(list.BoardId);

      if (board) {
        const lists = await board.getLists();
        if (!list.orderNum) {
          list.orderNum = lists.length + 1;
          return;
        }
      }
    } catch (e) {
      return;
    }
  });

  return List;
};
