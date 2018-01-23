const { User, Board, List, Card, Event } = require('../models');

const getBoardWithAssociations = async (id) => {
  return await Board.find({
    where: { id },
    include: [{
      model: List,
      include: [{
        model: Card,
        include: [
          List,
          { model: Event, include: [ User ] },
          User
        ]
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
    const user = await User.findById(id);
    const memberBoards = await getMemberBoards(user);
    user.Boards = memberBoards;
    return user;
  } catch (e) {
    return undefined;
  }
};

const getMemberBoards = async (user) => {
  const cards = await user.getCards({
    include: [{
      model: List,
      include: [ Board ]
    }]
  });

  const boards = await user.getBoards({
    include: [{
      model: List,
      include: [{
        model: Card,
        include: [
          List,
          { model: Event, include: [ User ] },
          User
        ]
      }]
    }],
    order: [
      [ List, 'createdAt', 'DESC' ],
      [ List, Card, 'createdAt', 'DESC' ],
      [ List, Card, Event, 'createdAt', 'DESC' ]
    ]
  });

  const boardIds = boards.map(b => b.id);

  for (let card of cards) {
    if (!boardIds.includes(card.List.Board.id)) {
      const board = await getBoardWithAssociations(card.List.Board.id);
      board.dataValues.notOwned = true;
      boards.push(board);
    }
  }

  return boards.sort((a, b) => a.createdAt > b.createdAt);
};

module.exports = {
  getBoardWithAssociations,
  findUserWithBoards
};
