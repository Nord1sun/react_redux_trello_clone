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
    ListId: DataTypes.INTEGER,
    orderNum: DataTypes.INTEGER
  });

  Card.hook('beforeValidate', async (card) => {
    try {
      const list = await sequelize.models.List.findById(card.ListId);

      if (list) {
        const cards = await list.getCards();
        if (!card.orderNum) {
          card.orderNum = cards.length + 1;
          return;
        }
      }
    } catch (e) {
      return;
    }
  });

  return Card;
};
