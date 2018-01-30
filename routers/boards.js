const express = require('express');
const router = express.Router();
const { User, Board} = require('../models');
const { checkForToken } = require('../helpers/authentication');
const { getBoardWithAssociations, findUserWithBoards } = require('../helpers/modelIncludeHelper');
const { findUserByToken } = require('../helpers/requestValidation');

router.use(checkForToken);
router.use(findUserByToken);

router.get('/', (req, res, next) => {
  findUserWithBoards(res.locals.user.id)
    .then(user => {
      if (!user) {
        res.json({ message: 'No user found' });
        return;
      }
      res.json({ status: 200, boards: user.Boards });
    })
    .catch(e => next(e));
});

router.post('/', (req, res, next) => {
  User.find({ where: { token: req.query.token } })
    .then(user => {
      if (!user) res.status(404).json({ status: 404, message: 'User not found' });

      return Board.create({ UserId: user.id });
    })
    .then(board => {
      return getBoardWithAssociations(board.id);
    })
    .then(board => {
      res.json({ status: 200, board });
    })
    .catch(e => next(e));
});

router.put('/:id', (req, res, next) => {
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
      return getBoardWithAssociations(board.id);
    })
    .then(board => {
      res.json({ status: 200, board });
    })
    .catch(e => next(e));
});

router.delete('/:id', (req, res, next) => {
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

      board.destroy()
        .then(() => {
          res.json({
            status: 200,
            message: `${ board.title } deleted successfully`,
            board
          });
        });
    })
    .catch(e => next(e));
});

module.exports = router;
