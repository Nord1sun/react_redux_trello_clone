const { Board, List, Card } = require('./../models');

module.exports = {
  up: async (queryInterface) => {
    const board = await Board.find({ include: [ List ] });
    var cards = [];

    for (let list of board.Lists) {
      for (var i = 0; i < 5; i++) {
        cards.push({
          title: `card${ i }`,
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non felis tristique, tempor arcu euismod, sagittis sem.',
          ListId: list.id,
          completed: false
        });
      }
    }

    return queryInterface.bulkInsert('Cards', cards);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Cards', null, {}, Card);
  }
};
