const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.post('/new', (req, res) => {
  const { email, password } = req.body;

  User.find({ where: { email } })
    .then(user => {
      if (!user || !user.validPassword(password)) {
        res.status(404).json({ status: 404, message: 'Invalid email/password' });
      } else {
        const data = { email, fullName: user.fullName };
        res.status(200).json({ token: user.token, data });
      }
    })
    .catch(e => res.status(500).json({ message: 'Application Error', stack: e.stack }));
});

module.exports = router;
