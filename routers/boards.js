const express = require('express');
const router = express.Router();
const { User, Board } = require('../models');

router.get('/:userId', (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      return user.getBoards();
    })
    .then(boards => {
      res.json({ boards });
    })
    .catch(e => next(e));
});

router.post('/', checkForToken, (req, res, next) => {
  User.find({ where: { token: req.query.token } })
    .then(user => {
      if (!user) res.status(404).json({ status: 404, message: 'User not found' });

      return Board.create({ UserId: user.id });
    })
    .then(board => {
      res.json({ status: 200, data: board });
    })
    .catch(e => next(e));
});

router.put('/:id', checkForToken, (req, res, next) => {
  User.find({ where: { token: req.query.token } })
    .then(user => {
      if (!user) res.status(404).json({ status: 404, message: 'User not found' });

      return user.getBoards();
    })
    .then(boards => {
      const board = boards.find(board => board.id === parseInt(req.params.id));

      if (!board) {
        res.status(403).json({
          status: 403,
          message: 'Forbidden - Board does not belong to the user provided'
        });
      }

      if (!req.body.title) res.status(400).json({ status: 400, message: "No Title Given" });

      return board.update({ title: req.body.title });
    })
    .then(board => {
      res.json({ status: 200, board });
    })
    .catch(e => next(e));
});

router.delete('/:id', checkForToken, (req, res, next) => {
  User.find({ where: { token: req.query.token } })
    .then(user => {
      if (!user) res.status(404).json({ status: 404, message: 'User not found' });

      return user.getBoards();
    })
    .then(boards => {
      const board = boards.find(board => board.id === parseInt(req.params.id));

      if (!board) {
        res.status(403).json({
          status: 403,
          message: 'Forbidden - Board does not belong to the user provided'
        });
      }

      board.destroy();
      res.json({
        status: 200,
        message: `${ board.title } deleted successfully`,
        board
      });
    })
    .catch(e => next(e));
});

function checkForToken(req, res, next) {
  if (!req.query.token) {
    res.status(403).json({ status: 403, message: 'Forbidden - No Token Provided' });
  } else {
    next();
  }
}

module.exports = router;
