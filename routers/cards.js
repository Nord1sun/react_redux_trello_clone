const express = require('express');
const router = express.Router();
const { User, Card, List, Board, Event } = require('../models');
const { checkForToken } = require('../helpers/authentication');
const { findUserWithBoards, getListWithCards } = require('../helpers/modelIncludeHelper');
const { findUserByToken, validateParamId,
  checkIfCardMember, validateMoveCardBody } = require('../helpers/requestValidation');

router.use(checkForToken);
router.use(findUserByToken);

router.post('/', async (req, res, next) => {
  const { ListId, description } = req.body;
  const { user } = res.locals;

  if (!ListId || !description) {
    res.status(400).json({ status: 400, message: "Needs ListId and description" });
    return;
  }

  try {
    const list = await List.findById(ListId);
    if (!list) {
      res.status(404).json({ status: 404, message: 'List not found' });
      return;
    }

    const card = await Card.create({ ListId, description });
    const boardOwner = await list.getUser();
    await card.addUsers([user, boardOwner]);

    await Event.create({
      action: `added this card to the ${ list.title } list`, UserId: user.id, CardId: card.id
    });

    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateParamId, async (req, res, next) => {
  const { description, completed } = req.body;
  const { user } = res.locals;

  if(!description || (completed !== true && completed !== false)) {
    res.status(400).json({
      status: 400, message: 'Invalid body - needs a description and a completed attribute'
    });
    return;
  }

  try {
    const card = await Card.findById(req.params.id);

    const member = await checkIfCardMember(user, card, res, next);
    if (!member) {
      res.status(401).json({ status: 401, message: 'Unauthorized' });
      return;
    }

    await card.update({ description, completed });

    await Event.create({
      action: `changed this card's description to ${ card.description }`, UserId: user.id, CardId: card.id
    });

    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validateParamId, async (req, res, next) => {
  const { user } = res.locals;

  try {
    const card = await Card.findById(req.params.id);

    const member = await checkIfCardMember(user, card, res, next);
    if (!member) {
      res.status(401).json({ status: 401, message: 'Unauthorized' });
      return;
    }

    await card.destroy();

    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/search_non_members', validateParamId, async (req, res, next) => {
  const searchTerm = decodeURIComponent(req.query.term).trim();
  if (!searchTerm) {
    res.status(200).json({ status: 200, users: [] });
  } else {
    try {
      const card = await Card.findById(req.params.id);
      const existingMembers = await card.getUsers();

      const allMatchingUsers = await User.findAll({
        where: {
          fullName: { $iLike: `%${searchTerm}%`}
        }
      });

      const existingIds = existingMembers.map(m => m.id);
      const users = allMatchingUsers.filter(user => {
        return !existingIds.includes(user.id);
      });

      res.status(200).json({ status: 200, users });
    } catch (error) {
      next(error);
    }
  }
});

router.post('/:id/add_member/:userId', validateParamId, async (req, res, next) => {
  try {
    await handleMemberRequest('add', res, req, next);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id/remove_member/:userId', validateParamId, async (req, res, next) => {
  try {
    await handleMemberRequest('remove', res, req, next);
  } catch (error) {
    next(error);
  }
});

const handleMemberRequest = async (type, res, req, next) => {
  const { user } = res.locals;
  try {
    const card = await Card.find({
      where: { id: req.params.id },
      include: [{
        model: List,
        include: [ Board ]
      }]
    });
    if (!card) {
      res.status(404).json({ status: 404, message: 'Card not found' });
      return;
    }

    const existingMembers = await card.getUsers();
    const existingIds = existingMembers.map(m => m.id);

    if (!existingIds.includes(user.id)) {
      res.status(403).json({ status: 403, message: 'Unauthorized' });
    } else {
      const member = await User.findById(req.params.userId);
      if (!member) {
        res.status(404).json({ status: 404, message: 'User not found' });
        return;
      }

      if (type === 'add') {
        await card.addUser(member);
      } else { // remove
        const board = card.List.Board;
        if (board.UserId === member.id) {
          res.status(403).json({ status: 403, message: 'Cannot remove the board owner from card' });
          return;
        }

        await card.removeUser(member);
      }

      const userWithBoards = await findUserWithBoards(user.id);
      res.json({ status: 200, boards: userWithBoards.Boards });
    }
  } catch (error) {
    next(error);
  }
};

router.put('/move/:id', validateParamId, validateMoveCardBody, async (req, res, next) => {
  const { user } = res.locals;
  const { toListId, fromListId, orderNum } = req.body;

  if (!fromListId || !toListId || !orderNum) {
    res.status(400).json({ status: 400, message: 'Invalid body - toListId, fromListId, and orderNum needed' });
    return;
  }

  try {
    const card = await Card.findById(req.params.id);
    const member = await checkIfCardMember(user, card, res, next);
    if (!member) {
      res.status(401).json({ status: 401, message: 'Unauthorized' });
      return;
    }

    const toList = await getListWithCards(toListId);

    await card.update({ ListId: toList.id });

    if (toListId === fromListId) {
      // remove the card from it's original position...
      const toListCardIds = toList.Cards.map(c => c.id);
      toList.Cards.splice(toListCardIds.indexOf(card.id), 1);
    }

    // add the card at the new position
    toList.Cards.splice(orderNum - 1, 0, card);

    // normalize card positions based on current index
    for (let c of toList.Cards) {
      await c.update({ orderNum: toList.Cards.indexOf(c) + 1 });
    }

    if (toListId !== fromListId) {
      const fromList = await getListWithCards(fromListId);
      for (let c of fromList.Cards) {
        await c.update({ orderNum: fromList.Cards.indexOf(c) + 1 });
      }

      // only add event if list changed
      await Event.create({
        action: `moved this card from the ${ fromList.title } list to the ${ toList.title } list`,
        UserId: user.id,
        CardId: card.id
      });
    }

    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
