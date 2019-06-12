/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import config from 'config';


module.exports = function auth(req, res, next) {
  const token = req.header('x-auth');
  if (!token) {
    return res.status(403).send({
      status: res.statusCode,
      message: 'Access denied',
    });
  }
  try {
    const decode = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decode;
    next();
  } catch (e) {
    return res.status(400).send({
      status: res.statusCode,
      message: 'Invalid token',
    });
  }
};
