const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.token;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Not Authorized. Login again.' });
  }

  // Support "Bearer <token>" or raw token
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // always set req.user – use this everywhere in controllers
    req.user = { id: payload.id, _id: payload.id };

    if (!req.body) req.body = {};
    req.body.userId = payload.id; // also set userId in body for convenience

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = authUser;
