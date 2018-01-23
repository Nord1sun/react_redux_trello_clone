const express = require('express');
const router = express.Router();
const { User, Card, List, Board } = require('../models');
const { checkForToken } = require('../helpers/authentication');
const { findUserWithBoards } = require('../helpers/modelIncludeHelper');
const { findUserByToken, validateParamId, checkIfCardMember } = require('../helpers/requestValidation');

router.use(checkForToken);

router.post('/', async (req, res, next) => {
  const { ListId, description } = req.body;

  if (!ListId || !description) {
    res.status(400).json({ status: 400, message: "Needs ListId and description" });
    next();
  }

  try {
    const user = await findUserByToken(req.query.token, res, next);

    const card = await Card.create({ ListId, description });
    await card.addUser(user);

    const userWithBoards = await findUserWithBoards(user.id);

    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateParamId, async (req, res, next) => {
  const { description, completed } = req.body;
  if(!description || (completed !== true && completed !== false)) {
    res.status(400).json({ status: 400, message: 'Invalid body - needs a description and completed attribute' });
    next();
  }

  try {
    const user = await findUserByToken(req.query.token, res, next);
    const card = await Card.findById(req.params.id);

    await checkIfCardMember(user, card, res, next);

    await card.update({ description, completed });

    const userWithBoards = await findUserWithBoards(user.id);

    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validateParamId, async (req, res, next) => {
  try {
    const user = await findUserByToken(req.query.token, res, next);

    const card = await Card.findById(req.params.id);

    await checkIfCardMember(user, card, res, next);

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
      await findUserByToken(req.query.token, res, next);

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
  try {
    const user = await findUserByToken(req.query.token, res, next);

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

module.exports = router;
