/* eslint-disable camelcase */
import { Router } from 'express';
import Joi from '@hapi/joi';
import moment from 'moment';
import auth from './middleware/auth';
import admin from './middleware/admin';

const _ = require('lodash');


const router = Router();

const cars = [
  {
    id: 1,
    owner: 2,
    created_on: '21/05/2019',
    state: 'used',
    status: 'sold',
    price: 200.1,
    manufacturer: 'audi',
    model: 'mastung',
    body_type: 'car',
  },
  {
    state: 'used',
    status: 'sold',
    price: '400',
    manufacturer: 'toyota',
    model: 'premio',
    body_type: 'car',
    id: 2,
    date_created: '2019-05-28T19:39:16+03:00',
  },
  {
    state: 'used',
    status: 'sold',
    price: '300',
    manufacturer: 'toyota',
    model: 'premio',
    body_type: 'car',
    id: 3,
    date_created: '2019-05-28T19:39:22+03:00',
  },
  {
    state: 'used',
    status: 'sold',
    price: '200',
    manufacturer: 'toyota',
    model: 'premio',
    body_type: 'car',
    id: 4,
    date_created: '2019-05-28T19:39:29+03:00',
  },
];

const orders = [
  {
    car_id: '5',
    price_offered: '1000',
    id: 1,
    date_created: '2019-05-29T00:15:16+03:00',
    status: 'unsold',
    price: '200',
  },
];


router.get('/car', (req, res) => {
  const { status, min_price, max_price } = req.query;

  if (status === 'available') {
    const available = cars.find(car => car.status === 'sold');
    if (!available) {
      return res.send({
        status: 200,
        data: 'There are no car available',
      });
    }
    return res.send({
      status: 200,
      data: [available],
    });
  }
  if (min_price !== undefined && max_price !== undefined) {
    const available = cars.filter(elem => (elem.price >= min_price && elem.price <= max_price));

    if (!available) {
      return res.send({
        status: 200,
        data: 'There are no car available',
      });
    }
    res.status(200).send({
      status: res.statusCode,
      data: available,
    });
  }
  return res.status(400).send({
    status: res.statusCode,
    data: 'Something went wrong',
  });
});
router.post('/car', auth, async (req, res) => {
  // pick the values from the users
  const rawData = _.pick(req.body, ['state', 'status', 'price',
    'manufacturer', 'model', 'body_type']);
  const schema = Joi.object().keys({
    state: Joi.string()
      .required(),
    status: Joi.string()
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

  if (results.error === null) {
    // update data
    rawData.id = cars.length + 1;
    rawData.owner = req.user.id;
    rawData.date_created = moment().format();

    // update the list of users
    cars.push(rawData);
    res.status(201).send(
      {
        status: res.statusCode,
        message: 'Account has been created successfully',
        data: rawData,
      },
    );
  } else {
    res.status(400).send(
      {
        status: res.statusCode,
        data: results.error,

      },
    );
  }
});

// TODO: User can view a specific car
router.get('/car/:id', (req, res) => {
  const details = cars.find(car => car.id === parseInt(req.params.id, 10));
  if (!details) {
    return res.status(404).send(
      {
        status: res.statusCode,
        data: 'not found',

      },
    );
  }
  return res.send(
    {
      status: res.statusCode,
      data: details,

    },
  );
});

// TODO: seller can update the price
router.put('/car/:id/price', auth, (req, res) => {
  const rawData = _.pick(req.body, ['price']);
  const details = cars.find(car => car.id === parseInt(req.params.id, 10));
  if (!details) {
    return res.status(404).send(
      {
        status: res.statusCode,
        data: 'not found',

      },
    );
  }
  if (req.user.id !== details.owner) {
    return res.send({
      status: res.statusCode,
      data: 'cannot perform this action',
    });
  }
  details.price = rawData.price;
  return res.send(
    {
      status: res.statusCode,
      data: details,

    },
  );
});


// TODO: seller can mark his/her posted AD as sold
router.put('/car/:id/status', auth, (req, res) => {
  const rawData = _.pick(req.body, ['status']);
  const details = cars.find(car => car.id === parseInt(req.params.id, 10));
  if (!details) {
    return res.status(404).send(
      {
        status: res.statusCode,
        data: 'not found',

      },
    );
  }
  if (req.user.id !== details.owner) {
    return res.send({
      status: res.statusCode,
      data: 'cannot perform this action',
    });
  }
  details.status = rawData.status;
  return res.send(
    {
      status: res.statusCode,
      data: details,

    },
  );
});
// TODO: seller can update the price of his/her posted AD
router.put('/car/:id/price', auth, (req, res) => {
  const rawData = _.pick(req.body, ['price']);
  const details = cars.find(car => car.id === parseInt(req.params.id, 10));
  if (!details) {
    return res.status(404).send(
      {
        status: res.statusCode,
        data: 'not found',

      },
    );
  }
  if (details.owner === auth.id) {
    details.price = rawData.price;
    return res.send(
      {
        status: res.statusCode,
        data: details,
      },
    );
  }
  return res.status(404).send(
    {
      status: res.statusCode,
      data: 'not found',

    },
  );
});

// TODO: buyer can make a purchase order
router.post('/order', auth, async (req, res) => {
  // pick the values from the users
  const rawData = _.pick(req.body, ['car_id', 'price_offered']);
  const schema = Joi.object().keys({
    car_id: Joi.string().alphanum()
      .required(),
    price_offered: Joi.string()
      .required(),
  });
  const results = Joi.validate(rawData, schema);

  if (results.error === null) {
    const details = cars.find(car => car.id === parseInt(rawData.car_id, 10));
    if (!details) {
      res.status(404).send(
        {
          status: res.statusCode,
          data: 'car not found',
        },
      );
    }
    // update data
    rawData.id = orders.length + 1;
    rawData.date_created = moment().format();
    rawData.status = details.status;
    rawData.price = details.price;

    // update the list of orders
    orders.push(rawData);
    res.status(201).send(
      {
        status: res.statusCode,
        data: rawData,
      },
    );
  } else {
    res.status(400).send(
      {
        status: res.statusCode,
        data: results.error,

      },
    );
  }
});

// todo: buyer can be able to update purchase order
router.put('/order/:id/price', auth, async (req, res) => {
  // pick the values from the users
  const rawData = _.pick(req.body, ['new_price_offered']);
  const schema = Joi.object().keys({
    new_price_offered: Joi.string()
      .required(),
  });
  const results = Joi.validate(rawData, schema);

  if (results.error === null) {
    const details = orders.find(order => order.car_id === req.params.id
      && order.status === 'unsold');

    if (!details) {
      return res.status(404).send(
        {
          status: res.statusCode,
          data: 'car not found or a deal was already made',
        },
      );
    }
    const update = {
      id: details.id,
      car_id: details.car_id,
      status: details.status,
      old_price_offered: details.price_offered,
      new_price_offered: rawData.new_price_offered,
    };
    // update data
    details.price_offered = rawData.new_price_offered;
    return res.status(201).send(
      {
        status: res.statusCode,
        data: update,
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
// TODO: Admin can delete a posted AS record
router.delete('/car/:id/', [auth, admin], (req, res) => {
  const details = cars.find(car => car.id === parseInt(req.params.id, 10));
  if (!details) {
    return res.status(404).send(
      {
        status: res.statusCode,
        data: 'not found',

      },
    );
  }
  const index = cars.indexOf(details);
  cars.splice(index, 1);
  return res.status(201).send(
    {
      status: res.statusCode,
      data: 'car Ad successfully deleted',

    },
  );
});
// TODO: Admin can view posted ads if sold or unsold
router.get('/all', [auth, admin], (req, res) => res.send({
  status: 200,
  data: cars,
}));
export default router;
