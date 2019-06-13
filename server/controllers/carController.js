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
            message: 'There are no car available',
          });
        }
        return res.send({
          status: 200,
          message: 'request was completed successfully',
          data: available,
        });
      }
      if (min_price !== undefined && max_price !== undefined) {
        const available = carData.getCarsInPriceRange(min_price, max_price);
        if (!available || available.length === 0) {
          return res.status(404).send({
            status: res.statusCode,
            message: 'There are no car available',
          });
        }
        return res.status(200).send({
          status: res.statusCode,
          message: 'request was completed successfully',
          data: available,
        });
      }
      return res.status(400).send({
        status: res.statusCode,
        message: 'Something went wrong',
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
      message: 'something went wrong',
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
        message: 'not found',
      });
    }
    return res.send({
      status: res.statusCode,
      message: 'request was completed successfully',
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
        message: 'not found',
      });
    }
    if (req.user.id !== details.owner) {
      return res.status(401).send({
        status: res.statusCode,
        message: 'cannot perform this action',
      });
    }
    details.price = rawData.price;

    return res.send({
      status: res.statusCode,
      message: 'request was completed successfully',
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
        message: 'not found',
      });
    }
    if (req.user.id !== details.owner) {
      return res.status(401).send({
        status: res.statusCode,
        message: 'cannot perform this action',
      });
    }
    details.status = rawData.status;
    return res.send({
      status: res.statusCode,
      message: 'request was completed successfully',
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
          message: 'car not found',
        });
      }
      const checkInfo = carData.checkUserOrderExisting(req.user.id);
      if (checkInfo === undefined) {
        // update data
        carData.makeOrder(rawData, req.user.id, details);
        return res.status(201).send({
          status: res.statusCode,
          message: 'request was completed successfully',
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
      message: 'something went wrong',
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
          message: 'car not found or a deal was already made',
        });
      }
      const update = carData.updateOrder(details, rawData);
      return res.status(200).send({
        status: res.statusCode,
        message: 'request was completed successfully',
        data: update,
      });
    }
    return res.status(400).send({
      status: res.statusCode,
      message: 'Something went wrong',
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
        message: 'not found',
      });
    }
    carData.deleteCar(details);
    return res.status(200).send({
      status: res.statusCode,
      message: 'car Ad successfully deleted',
    });
  };
}

function getAll() {
  return (req, res) => res.send({
    status: 200,
    message: 'request was completed successfully',
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
