/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import jwt from 'jsonwebtoken';
import config from 'config';

const generateToken = (id, isAdmin, email) => {
  const token = jwt.sign({
    id, isAdmin, email,
  }, config.get('jwtPrivateKey'));
  return token;
};

const rangeFilter = (min_price, max_price, filtered) => {
  if (min_price > max_price) { min_price = [max_price, max_price = min_price][0]; }
  if (max_price) { filtered = filtered.filter(car => car.price <= max_price); }
  if (min_price) { filtered = filtered.filter(car => car.price >= min_price); }
  return { min_price, max_price, filtered };
};

module.exports = {
  generateToken,
  rangeFilter,
};
