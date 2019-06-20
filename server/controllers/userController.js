import {
  compare,
} from 'bcryptjs';
import UserModel from '../models/userModel';
import generatePassword from '../helpers/generatePassword';
import helpers from '../helpers/utils';
import validator from '../helpers/validation';

const _ = require('lodash');


const createUser = async (req, res) => {
  // pick the values from the users
  const rawData = _.pick(req.body, ['email', 'first_name', 'last_name',
    'password', 'address', 'is_admin',
  ]);
  const results = validator.validateUser(rawData);
  if (results.error === null) {
    const details = await UserModel.checkuser(rawData);
    if (details.rowCount > 0) {
      return res.status(409).send({
        status: res.statusCode,
        message: 'user already exists',
      });
    }
    // generate a hashed password
    const newPassword = await generatePassword(rawData, UserModel.totalUsers());
    // update data
    rawData.password = newPassword;
    // update the list of users
    const token = helpers.generateToken(rawData.id, rawData.is_admin, rawData.email);
    const data = await UserModel.addUser(rawData);
    return res.status(201).send({
      status: res.statusCode,
      message: 'Account has been created successfully',
      token,
      data: _.pick(data, ['userid', 'first_name', 'last_name', 'email']),
    });
  }
  return res.status(400).send({
    status: res.statusCode,
    message: results.error.details[0].message,
  });
};

const loginUser = async (req, res) => {
  const rawData = _.pick(req.body, ['email', 'password']);
  // validate the user input data
  const results = validator.validateLogin(rawData);
  if (results.error === null) {
    // check if the user exists in the database
    const details = await UserModel.checkuser(rawData);
    if (details.rowCount === 0) {
      return res.status(400).send({
        status: res.statusCode,
        message: 'something went wrong with your password or email',
      });
    }
    const userData = details.rows[0];
    // validate the password
    const validPassword = await compare(rawData.password, userData.password);
    if (!validPassword) {
      return res.status(400).send({
        status: res.statusCode,
        message: 'Invalid email or password',
      });
    }
    // generate a token
    const token = helpers.generateToken(userData.userid, userData.is_admin, userData.email);
    const message = function generateMessage(userType) {
      if (userType !== true) {
        return 'welcome back our esteemed customer';
      }
      return 'Welcome sir the panel is ready for you';
    };
    return res.status(200).header('x-auth', token).send({
      status: res.statusCode,
      message: message(userData.is_admin),
      data: {
        token,
        id: userData.userid,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
      },
    });
  }
  return res.status(400).send({
    status: res.statusCode,
    message: 'something went worng',
    data: results.error.details[0].message,
  });
};

module.exports = {
  loginUser,
  createUser,
};
