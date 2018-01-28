const { User, List } = require('../models');

async function findUserByToken(req, res, next) {
  try {
    const user = await User.find({ where: { token: req.query.token } });
    if (!user) {
      res.status(404).json({ status: 404, message: 'User not found' });
    } else {
      res.locals.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
}

async function checkForListTitle(req, res, next) {
  if (!req.body.title) {
    res.status(400).json({ status: 400, message: 'No list title given' });
  } else {
    next();
  }
}

async function checkForList(req, res, next) {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      res.status(404).json({ status: 404, message: 'List not found' });
    } else {
      res.locals.list = list;
      next();
    }
  } catch (error) {
    console.error(error);
  }
}

function validateParamId(req, res, next) {
  if (!parseInt(req.params.id)
    || (req.params.userId && !parseInt(req.params.userId))
    || (req.params.boardId && !parseInt(req.params.boardId))
  ) {
    res.status(400).json({ status: 400, message: 'Invalid ID param' });
  } else {
    next();
  }
}

function validateMoveCardBody(req, res, next) {
  const { toListId, fromListId, orderNum } = req.body;
  if (toListId && !parseInt(toListId)
    || fromListId && !parseInt(fromListId)
    || orderNum && !parseInt(orderNum)
  ) {
    res.status(400).json({ status: 400, message: 'Invalid request body' });
  } else {
    next();
  }
}

async function checkIfCardMember(user, card) {
  const members = await card.getUsers();
  const memberIds = members.map(member => member.id);

  // user is not a member
  if (memberIds.indexOf(user.id) === -1) return false;

  return true;
}

module.exports = {
  findUserByToken,
  checkForListTitle,
  checkForList,
  validateParamId,
  checkIfCardMember,
  validateMoveCardBody
};
