const express = require('express');
const router = express.Router();
const { checkForToken } = require('../helpers/authentication');
const { findUserWithBoards } = require('../helpers/modelIncludeHelper');
const { findUserByToken, checkForListTitle } = require('../helpers/requestValidation');
const { User, List } = require('../models');

router.post('/', checkForToken, async (req, res, next) => {
  const { title, BoardId } = req.body;
  await checkForListTitle(req.body.title, res, next);

  try {
    const user = await findUserByToken(req.query.token, res, next);

    await List.create({ title, BoardId });

    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', checkForToken, async (req, res, next) => {
  if (!parseInt(req.params.id)) {
    res.status(404).json({ status: 400, message: 'List not found' });
    next();
  }

  await checkForListTitle(req.body.title, res, next);

  try {
    const user = await findUserByToken(req.query.token, res, next);

    const list = await List.findById(req.params.id);
    if (!list) {
      res.status(404).json({ status: 404, message: 'List not found' });
      next();
    }

    await list.update({ title: req.body.title });

    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
