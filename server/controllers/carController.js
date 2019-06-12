/* eslint-disable camelcase */
import validator from '../helpers/validation';
import CarModel from '../models/carModels';

const _ = require('lodash');

const carData = new CarModel();

function viewCarManager() {
  return (req, res, next) => {
    try {
      const { status, min_price, max_price } = req.query;
      if (status === 'available') {
        const available = carData.findAllAvialable();
        if (!available) {
          return res.status(404).send({
            status: res.statusCode,
            data: 'There are no car available',
          });
        }
        return res.send({
          status: 200,
          data: available,
        });
      }
      if (min_price !== undefined && max_price !== undefined) {
        const available = carData.getCarsInPriceRange(min_price, max_price);
        if (!available || available.length === 0) {
          return res.status(404).send({
            status: res.statusCode,
            data: 'There are no car available',
          });
        }
        return res.status(200).send({
          status: res.statusCode,
          data: available,
        });
      }
      return res.status(400).send({
        status: res.statusCode,
        data: 'Something went wrong',
      });
    } catch (err) {
      return next(err);
    }
  };
}


function addCar() {
  return async (req, res) => {
    // pick the values from the users
    const rawData = _.pick(req.body, [
      'state',
      'status',
      'price',
      'manufacturer',
      'model',
      'body_type',
    ]);
    const results = validator.validateCarDetails(rawData);
    if (results.error === null) {
      // update data
      carData.addcarData(rawData, req);
      return res.status(201).send({
        status: res.statusCode,
        message: 'Car AD has been created successfully',
        data: rawData,
      });
    }
    return res.status(400).send({
      status: res.statusCode,
      data: results.error,
    });
  };
}

function singleCar() {
  return (req, res) => {
    const details = carData.checkCarId(req.params.id);
    if (!details) {
      return res.status(404).send({
        status: res.statusCode,
        data: 'not found',
      });
    }
    return res.send({
      status: res.statusCode,
      data: details,
    });
  };
}

function updatePrice() {
  return (req, res) => {
    const rawData = _.pick(req.body, ['price']);
    const details = carData.checkCarId(req.params.id);

    if (!details) {
      return res.status(404).send({
        status: res.statusCode,
        data: 'not found',
      });
    }
    if (req.user.id !== details.owner) {
      return res.status(401).send({
        status: res.statusCode,
        data: 'cannot perform this action',
      });
    }
    details.price = rawData.price;

    return res.send({
      status: res.statusCode,
      data: details,
    });
  };
}

function updateStatus() {
  return (req, res) => {
    const rawData = _.pick(req.body, ['status']);
    const details = carData.checkCarId(req.params.id);
    if (!details) {
      return res.status(404).send({
        status: res.statusCode,
        data: 'not found',
      });
    }
    if (req.user.id !== details.owner) {
      return res.status(401).send({
        status: res.statusCode,
        data: 'cannot perform this action',
      });
    }
    details.status = rawData.status;
    return res.send({
      status: res.statusCode,
      data: details,
    });
  };
}

function makeOrder() {
  return async (req, res) => {
    // pick the values from the users
    const rawData = _.pick(req.body, ['car_id', 'price_offered']);
    const results = validator.validateOrder(rawData);
    if (results.error === null) {
      const details = carData.checkCarId(rawData.car_id);
      if (!details) {
        return res.status(404).send({
          status: res.statusCode,
          data: 'car not found',
        });
      }
      const checkInfo = carData.checkUserOrderExisting(req.user.id);
      console.log(`userId: ${req.user.id} output: ${checkInfo}`);
      if (checkInfo === undefined) {
        // update data
        carData.makeOrder(rawData, req.user.id, details);
        return res.status(201).send({
          status: res.statusCode,
          data: rawData,
        });
      }
      return res.status(409).send({
        status: res.statusCode,
        message: 'you can not make the same order more than once',
      });
    }
    return res.status(400).send({
      status: res.statusCode,
      data: results.error,
    });
  };
}

function updateOrder() {
  return async (req, res) => {
    // pick the values from the users
    const { results, rawData } = validator.checkOrderUpdateDetails(req);
    if (results.error === null) {
      const details = carData.checkOrder(req);
      if (!details) {
        return res.status(404).send({
          status: res.statusCode,
          data: 'car not found or a deal was already made',
        });
      }
      const update = carData.updateOrder(details, rawData);
      return res.status(200).send({
        status: res.statusCode,
        data: update,
      });
    }
    return res.status(400).send({
      status: res.statusCode,
      data: results.error,
    });
  };
}

function deleteAD() {
  return (req, res) => {
    const details = carData.checkCarId(req.params.id);
    if (!details) {
      return res.status(404).send({
        status: res.statusCode,
        data: 'not found',
      });
    }
    carData.deleteCar(details);
    return res.status(200).send({
      status: res.statusCode,
      data: 'car Ad successfully deleted',
    });
  };
}

function getAll() {
  return (req, res) => res.send({
    status: 200,
    data: carData.getAllCars(),
  });
}

module.exports = {
  viewCarManager,
  addCar,
  singleCar,
  updatePrice,
  updateStatus,
  makeOrder,
  updateOrder,
  deleteAD,
  getAll,
};
