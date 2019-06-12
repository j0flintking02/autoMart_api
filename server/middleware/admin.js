module.exports = function admin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).send({
      status: res.status_code,
      message: 'Access denied',
    });
  }
  return next();
};
