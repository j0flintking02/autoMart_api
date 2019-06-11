import {
  compare,
} from 'bcryptjs';
import UserModel from '../models/userModel';
import generatePassword from '../helpers/generatePassword';
import generateToken from '../helpers/utils';
import validator from '../helpers/validation';

const _ = require('lodash');

const Data = new UserModel();

function createUser() {
  return async (req, res) => {
    // pick the values from the users
    const rawData = _.pick(req.body, ['email', 'first_name', 'last_name',
      'password', 'address', 'is_admin',
    ]);
    const results = validator.validateUser(rawData);
    if (results.error === null) {
      const details = Data.checkuser(rawData);
      if (details) {
        return res.status(400).send({
          status: res.statusCode,
          data: 'user already exists',
        });
      }
      // generate a hashed password
      const newPassword = await generatePassword(rawData, Data.totalUsers());
      // update data
      rawData.id = Data.totalUsers() + 1;
      rawData.password = newPassword;
      // update the list of users
      Data.addUser(rawData);
      return res.status(201).send({
        status: res.statusCode,
        message: 'Account has been created successfully',
        data: _.pick(rawData, ['id', 'first_name', 'last_name', 'email']),
      });
    }
    return res.status(400).send({
      status: res.statusCode,
      data: results.error,
    });
  };
}


function loginUser() {
  return async (req, res) => {
    const rawData = _.pick(req.body, ['email', 'password']);
    // validate the user input data
    const results = validator.validateLogin(rawData);
    if (results.error === null) {
      // check if the user exists in the database
      const details = Data.checkuser(rawData);
      if (!details) {
        return res.status(400).send({
          status: res.statusCode,
          data: 'something went wrong',
        });
      }
      // validate the password
      const validPassword = await compare(rawData.password, details.password);
      if (!validPassword) {
        return res.status(400).send({
          status: res.statusCode,
          message: 'Invalid email or password',
        });
      }
      // generate a token
      const token = generateToken(details.id, details.is_admin, details.email);
      return res.status(200).header('x-auth', token).send({
        status: res.statusCode,
        message: 'welcome back our esteemed customer',
        data: {
          token,
          id: details.id,
          first_name: details.first_name,
          last_name: details.last_name,
          email: details.email,
        },
      });
    }
    return res.status(400).send({
      status: res.statusCode,
      data: results.error,
    });
  };
}

module.exports = {
  loginUser,
  createUser,
};
