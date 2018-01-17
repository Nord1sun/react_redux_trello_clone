const { User, Board } = require('./../models');

module.exports = {
  up: async (queryInterface) => {
    const user = await User.find();
    var boards = [];

    for (var i = 0; i < 5; i++) {
      boards.push({
        title: `Board${ i }`,
        UserId: user.id
      });
    }

    return queryInterface.bulkInsert('Boards', boards);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Boards', null, {}, Board);
  }
};
