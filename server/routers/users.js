import { compare } from 'bcryptjs';
import { Router } from 'express';
import Joi from '@hapi/joi';
import generatePassword from './helpers/generatePassword';
import generateToken from './helpers/utils';

const _ = require('lodash');

const router = Router();

const users = [
  {
    id: 1,
    email: 'jonathanaurugai@gmail.com',
    first_name: 'Jonathan',
    last_name: 'Aurugai',
    password: 'Root1234',
    address: '',
    is_admin: true,
  },
  {
    id: 2,
    email: 'johndoe@gmail.com',
    first_name: 'John',
    last_name: 'Doe',
    password: 'Root1234',
    address: '',
    is_admin: true,
  },
];


router.post('/signup', async (req, res) => {
  // pick the values from the users
  const rawData = _.pick(req.body, ['email', 'first_name', 'last_name',
    'password', 'address', 'is_admin']);
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
  if (results.error === null) {
    const details = users.find(user => user.email === rawData.email);
    if (details) {
      return res.status(400).send(
        {
          status: res.statusCode,
          data: 'user already exists',

        },
      );
    }
    // generate a hashed password
    const newPassword = await generatePassword(rawData, users.length);

    // update data
    rawData.id = users.length + 1;
    rawData.password = newPassword;

    // update the list of users
    users.push(rawData);
    return res.status(201).send(
      {
        status: res.statusCode,
        message: 'Account has been created successfully',
        data: _.pick(rawData, ['id', 'first_name', 'last_name', 'email']),
      },
    );
  }
  return res.status(400).send(
    {
      status: res.statusCode,
      data: results.error,

    },
  );
});

router.post('/signin', async (req, res) => {
  const rawData = _.pick(req.body, ['email', 'password']);
  // validate the user input data
  const schema = Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
  });
  const results = Joi.validate(rawData, schema);
  if (results.error === null) {
    // check if the user exists in the database
    const details = users.find(user => user.email === rawData.email);
    if (!details) {
      res.status(400).send(
        {
          status: res.statusCode,
          data: 'something went wrong',

        },
      );
    }
    // validate the password
    const validPassword = await compare(rawData.password, details.password);
    if (!validPassword) {
      return res.status(400).send({ message: 'Invalid email or password' });
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
  return res.status(400).send(
    {
      status: res.statusCode,
      data: results.error,

    },
  );
});


// TODO: Admin can delete a posted AS record
// TODO: Admin can view posted ads if sold or unsold

export default router;
