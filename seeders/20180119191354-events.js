const { User, Card, Event } = require('./../models');

module.exports = {
  up: async (queryInterface) => {
    const cards = await Card.findAll();
    const user = await User.find();
    let events = [];

    for (let card of cards) {
      events.push({
        UserId: user.id,
        CardId: card.id,
        action: 'changed the title of the card to Lorem Ipsum'
      });

      events.push({
        UserId: user.id,
        CardId: card.id,
        action: 'added this card to the \'To Do\' board'
      });
    }

    return queryInterface.bulkInsert('Events', events);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Events', null, {}, Event);
  }
};

