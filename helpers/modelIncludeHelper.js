const { User, Board, List, Card, Event } = require('../models');

const getBoardWithAssociations = async (id) => {
  return await Board.find({
    where: { id },
    include: [{
      model: List,
      include: [{
        model: Card,
        include: [ Event, User ]
      }]
    }],
    order: [
      [ List, 'createdAt', 'DESC' ],
      [ List, Card, 'createdAt', 'DESC' ],
      [ List, Card, Event, 'createdAt', 'DESC' ]
    ]
  });
};

const findUserWithBoards = async (id) => {
  try {
    return await User.find({
      where: { id },
      include: [{
        model: Board,
        include: [{
          model: List,
          include: [{
            model: Card,
            include: [ Event, User ]
          }]
        }]
      }],
      order: [
        [ Board, 'createdAt', 'ASC' ],
        [ Board, List, 'createdAt', 'ASC' ],
        [ Board, List, Card, 'createdAt', 'ASC' ],
        [ Board, List, Card, Event, 'createdAt', 'ASC' ]
      ]
    });
  } catch (e) {
    return undefined;
  }

};

module.exports = {
  getBoardWithAssociations,
  findUserWithBoards
};
