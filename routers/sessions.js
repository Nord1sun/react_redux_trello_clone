const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4');
const { User } = require('../models');

router.post('/new', (req, res) => {
  const { email, password } = req.body;

  User.find({ where: { email } })
    .then(user => {
      if (!user || !user.validPassword(password)) {
        res.status(404).json({ status: 404, message: 'Invalid email/password' });
      } else {
        const data = { email, fullName: user.fullName, id: user.id, img: user.img };
        res.status(200).json({ token: user.token, data });
      }
    })
    .catch(e => res.status(500).json({ message: 'Application Error' }));
});

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  User.create({
    fullName: name,
    email,
    password,
  }).then((user) => {
    const data = { email, fullName: user.fullName, id: user.id, img: user.img };
    res.status(200).json({ token: user.token, data });
  }).catch(e => {
    if (e.original.code === '23505') {
      res.status(409).json({ message: 'User already exists' })
    } else {
      res.status(500).json({ message: 'Application Error' })
    }
  });
});

module.exports = router;
