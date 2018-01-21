const express = require('express');
const router = express.Router();
const { checkForToken } = require('../helpers/authentication');
const { findUserWithBoards } = require('../helpers/modelIncludeHelper');
const { findUserByToken, checkForListTitle, checkForList, validateParamId } = require('../helpers/requestValidation');
const { List } = require('../models');

router.post('/', checkForToken, async (req, res, next) => {
  const { title, BoardId } = req.body;
  try {
    await checkForListTitle(req.body.title, res, next);

    const user = await findUserByToken(req.query.token, res, next);

    await List.create({ title, BoardId });

    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', checkForToken, validateParamId, async (req, res, next) => {
  try {
    await checkForListTitle(req.body.title, res, next);

    const user = await findUserByToken(req.query.token, res, next);

    const list = await List.findById(req.params.id);
    await checkForList(list, res, next);

    await list.update({ title: req.body.title });

    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', checkForToken, validateParamId, async (req, res, next) => {
  try {
    const user = await findUserByToken(req.query.token, res, next);

    const list = await List.findById(req.params.id);
    await checkForList(list, res, next);

    const listUser = await list.getUser();
    if (listUser.id !== user.id) {
      res.status(403).json({ status: 403, message: 'Forbidden - List does not belong to user' });
      next();
    }

    await list.destroy();
    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
