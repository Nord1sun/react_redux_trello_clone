function checkForToken(req, res, next) {
  if (!req.query.token) {
    res.status(403).json({ status: 403, message: 'Forbidden - Invalid token' });
  } else {
    next();
  }
}

module.exports = {
  checkForToken
};
