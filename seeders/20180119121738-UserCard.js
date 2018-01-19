const { User, Card, UserCard } = require('./../models');

module.exports = {
  up: async (queryInterface) => {
    const cards = await Card.findAll();
    const user = await User.find();
    let userCards = [];

    for (let card of cards) {
      userCards.push({
        UserId: user.id,
        CardId: card.id
      });
    }

    return queryInterface.bulkInsert('UserCard', userCards);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('UserCard', null, {}, UserCard);
  }
};
