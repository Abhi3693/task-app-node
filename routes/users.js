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
        // res.set('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ user: await user.userResponse(token) });
      } else {
        return res.status(403).json({ errors: ['could not find user'] });
      }
    } catch (error) {
      return res.status(401).json({ errors: [error] });
    }
  } else {
    // res.set('Access-Control-Allow-Origin', '*');
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
        // res.set('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ user: await user.userResponse(token) });
      } else {
        return res.status(403).json({ errors: ['User already taken'] });
      }
    } catch (error) {
      return res.status(401).json({ errors: [error] });
    }
  } else {
    return res
      .status(422)
      .json({ errors: ['Username, email, password required'] });
  }
});

//  Login user
router.post('/login', async (req, res, next) => {
  let { email, password } = req.body.user;
  if (!email && !password) {
    return res.status(422).json({ errors: ['email and password required'] });
  } else if (!email) {
    return res.status(422).json({ errors: ['email required'] });
  } else if (!password) {
    return res.status(422).json({ errors: ['email required'] });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ errors: ['Email is not registered'] });
    }

    let result = user.verifyPassword(password);
    if (!result) {
      return res.status(401).json({ errors: ['Password is not valid'] });
    }
    let token = await user.signToken();
    // res.set('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ user: await user.userResponse(token) });
  } catch (error) {
    return res.status(401).json({ errors: [error] });
  }
});

module.exports = router;
