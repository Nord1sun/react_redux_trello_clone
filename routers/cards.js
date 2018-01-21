const express = require('express');
const router = express.Router();
const { Card } = require('../models');
const { checkForToken } = require('../helpers/authentication');
const { findUserWithBoards } = require('../helpers/modelIncludeHelper');
const { findUserByToken, validateParamId, checkIfCardMember } = require('../helpers/requestValidation');

router.put('/:id', checkForToken, validateParamId, async (req, res, next) => {
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

router.delete('/:id', checkForToken, validateParamId, async (req, res, next) => {
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

module.exports = router;
