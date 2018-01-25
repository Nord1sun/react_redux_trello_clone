const express = require('express');
const router = express.Router();
const { checkForToken } = require('../helpers/authentication');
const { findUserWithBoards, getBoardWithLists } = require('../helpers/modelIncludeHelper');
const { findUserByToken, checkForListTitle, checkForList, validateParamId } = require('../helpers/requestValidation');
const { List } = require('../models');

router.use(checkForToken);
router.use(findUserByToken);

router.post('/', checkForListTitle, async (req, res, next) => {
  const { title, BoardId } = req.body;
  const user = res.locals.user;

  try {
    await List.create({ title, BoardId });

    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put('/:id', validateParamId, checkForList, checkForListTitle, async (req, res, next) => {
  const { user, list } = res.locals;

  try {
    await list.update({ title: req.body.title });

    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id', [ validateParamId, checkForList ], async (req, res, next) => {
  const { user, list } = res.locals;

  try {
    const listUser = await list.getUser();
    if (listUser.id !== user.id) {
      res.status(403).json({ status: 403, message: 'Forbidden - List does not belong to user' });
      return;
    }

    await list.destroy();
    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/reorder/:boardId/:id/:orderNum', validateParamId, async (req, res, next) => {
  const user = res.locals.user;
  try {
    const board = await getBoardWithLists(req.params.boardId);
    const list = await List.findById(req.params.id);

    // check if list belongs to board
    const listIds = board.Lists.map(l => l.id);
    if (!listIds.includes(list.id)) {
      res.status(403).json({ status: 403, message: 'List does not belong to requested board' });
      return;
    }

    // remove list from boards list...
    board.Lists.splice(listIds.indexOf(list.id), 1);
    // re-add it at proper index
    board.Lists.splice(req.params.orderNum - 1, 0, list);

    for (let l of board.Lists) {
      await l.update({ orderNum: board.Lists.indexOf(l) + 1 });
    }

    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (e) {
    console.error(e);
    next(e);
  }
});


module.exports = router;
