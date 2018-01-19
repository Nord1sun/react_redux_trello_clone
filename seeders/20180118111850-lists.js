const { Board, List } = require('./../models');

module.exports = {
  up: async (queryInterface) => {
    const board = await Board.find();
    var lists = [];

    for (var i = 0; i < 2; i++) {
      lists.push({
        title: `List${ i }`,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non felis tristique, tempor arcu euismod, sagittis sem.',
        BoardId: board.id
      });
    }

    return queryInterface.bulkInsert('Lists', lists);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Lists', null, {}, List);
  }
};
