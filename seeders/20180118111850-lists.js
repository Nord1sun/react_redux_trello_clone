const { Board, List } = require('./../models');

module.exports = {
  up: async (queryInterface) => {
    const board = await Board.find();
    var lists = [];

    for (var i = 0; i < 2; i++) {
      lists.push({
        title: `List${ i }`,
        BoardId: board.id,
        orderNum: i + 1
      });
    }

    return queryInterface.bulkInsert('Lists', lists);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Lists', null, {}, List);
  }
};
