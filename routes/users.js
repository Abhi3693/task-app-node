var express = require('express');
var router = express.Router();

const auth = require('../middlewares/auth');
const User = require('../models/User');

//  Authenticate user
router.get('/', auth.optionalVerification, async (req, res, next) => {
  if (req.user) {
    try {
      let user = await User.findById(req.user.id);
      if (user) {
        let token = req.headers.authorization;
        return res.status(200).json({ user: await user.userResponse(token) });
      } else {
        return res.status(403).json({ error: 'Could not find user' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Validation failed' });
    }
  } else {
    return res.status(200).json({ user: null });
  }
});

// Register user
router.post('/register', async (req, res, next) => {
  let { username, email, password } = req.body.user;
  if (username && password && email) {
    try {
      let findUser = await User.findOne({ email: email });
      if (!findUser) {
        let user = await User.create(req.body.user);
        let token = await user.signToken();
        return res.status(200).json({ user: await user.userResponse(token) });
      } else {
        return res.status(403).json({ error: 'User already taken' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Validation Failed' });
    }
  } else {
    return res
      .status(422)
      .json({ error: 'Username, email, password required' });
  }
});

//  Login user
router.post('/login', async (req, res, next) => {
  let { email, password } = req.body.user;
  if (!email && !password) {
    return res.status(422).json({ error: 'email and password required' });
  } else if (!email) {
    return res.status(422).json({ error: 'email required' });
  } else if (!password) {
    return res.status(422).json({ error: 'email required' });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email is not registered' });
    }
    let result = await user.verifyPassword(password);
    if (result) {
      let token = await user.signToken();
      return res.status(200).json({ user: await user.userResponse(token) });
    }
    return res.status(401).json({ error: 'Password is not valid' });
  } catch (error) {
    return res.status(401).json({ error: 'Validation failed' });
  }
});

module.exports = router;
