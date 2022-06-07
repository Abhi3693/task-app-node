var jwt = require('jsonwebtoken');

module.exports = {
  // Verifion of user
  verifyUser: async (req, res, next) => {
    let token = req.headers.authorization;
    try {
      let payload = await jwt.verify(token, process.env.SECRET_KEY);
      if (payload) {
        req.user = payload;
        next();
      } else {
        res.status(401).json({ error: ['token required'] });
      }
    } catch (error) {
      res.status(400).json({ error: [error] });
    }
  },

  // Optional Verification of user
  optionalVerification: async (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
      try {
        let payload = await jwt.verify(token, process.env.SECRET_KEY);
        if (payload) {
          req.user = payload;
          next();
        } else {
          res.status(401).json({ error: ['token required'] });
        }
      } catch (error) {
        res.status(400).json({ error: [error] });
      }
    } else {
      req.user = null;
      next();
    }
  },
};
