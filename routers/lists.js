const express = require('express');
const router = express.Router();
const { checkForToken } = require('../helpers/authentication');
const { findUserWithBoards } = require('../helpers/modelIncludeHelper');
const { User, List } = require('../models');

router.post('/', checkForToken, async (req, res, next) => {
  const { title, BoardId } = req.body;
  if (!title) {
    res.status(400).json({ status: 400, message: 'No list title given' });
    return;
  }

  try {
    const user = await User.find({ where: { token: req.query.token } });
    if (!user) {
      res.status(404).json({ status: 404, message: 'User not found' });
      return;
    }

    await List.create({ title, BoardId });
    const userWithBoards = await findUserWithBoards(user.id);
    res.json({ status: 200, boards: userWithBoards.Boards });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
