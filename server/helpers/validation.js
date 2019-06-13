import Joi from '@hapi/joi';

const _ = require('lodash');

function validateUser(rawData) {
  const schema = Joi.object().keys({
    email: Joi.string().email(),
    first_name: Joi.string().alphanum().min(3).max(30)
      .required(),
    last_name: Joi.string().alphanum().min(3).max(30)
      .required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
    address: Joi.string().alphanum().min(3).max(30)
      .required(),
    is_admin: Joi.boolean(),
  });
  // validate the data that has been entered
  const results = Joi.validate(rawData, schema);
  return results;
}
function validateLogin(rawData) {
  const schema = Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
  });
  const results = Joi.validate(rawData, schema);
  return results;
}

function validateCarDetails(rawData) {
  const schema = Joi.object().keys({
    state: Joi.string()
      .required(),
    status: Joi.boolean().valid('available').label('values must be available to proceed')
      .required(),
    price: Joi.string().alphanum()
      .required(),
    manufacturer: Joi.string()
      .required(),
    model: Joi.string()
      .required(),
    body_type: Joi.string()
      .required(),
  });
  const results = Joi.validate(rawData, schema);
  return results;
}

function validateOrder(rawData) {
  const schema = Joi.object().keys({
    car_id: Joi.string().alphanum()
      .required(),
    price_offered: Joi.string()
      .required(),
  });
  const results = Joi.validate(rawData, schema);
  return results;
}

function checkOrderUpdateDetails(req) {
  const rawData = _.pick(req.body, ['new_price_offered']);
  const schema = Joi.object().keys({
    new_price_offered: Joi.string()
      .required(),
  });
  const results = Joi.validate(rawData, schema);
  return { results, rawData };
}

module.exports = {
  validateUser,
  validateLogin,
  validateCarDetails,
  validateOrder,
  checkOrderUpdateDetails,
};
