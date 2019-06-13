/* eslint-disable camelcase */
import validator from '../helpers/validation';
import CarModel from '../models/carModels';

const _ = require('lodash');

// const carData = new CarModel();

function viewCarManager() {
  return async (req, res, next) => {
    try {
      const { status, min_price, max_price } = req.query;
      if (status === 'available') {
        const available = await CarModel.findAllAvialable();
        if (available.rowCount === 0) {
          return res.status(404).send({
            status: res.statusCode,
            message: 'There are no car available',
          });
        }
        return res.send({
          status: 200,
          message: 'request was completed successfully',
          data: available.rows,
        });
      }
      if (min_price !== undefined && max_price !== undefined) {
        const available = await CarModel.getCarsInPriceRange(min_price, max_price);
        if (available.rowCount === 0) {
          return res.status(404).send({
            status: res.statusCode,
            message: 'There are no car available',
          });
        }
        return res.status(200).send({
          status: res.statusCode,
          message: 'request was completed successfully',
          data: available.rows,
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
      const carResults = await CarModel.addCar(rawData, req);

      return res.status(201).send({
        status: res.statusCode,
        message: 'Car AD has been created successfully',
        data: carResults,
      });
    }
    return res.status(400).send({
      status: res.statusCode,
      message: 'something went wrong',
      data: results.error.details[0].message,
    });
  };
}

function singleCar() {
  return async (req, res) => {
    const details = await CarModel.checkCarId(req.params.id);
    if (details.rowCount === 0) {
      return res.status(404).send({
        status: res.statusCode,
        message: 'not found',
      });
    }
    return res.send({
      status: res.statusCode,
      message: 'request was completed successfully',
      data: details.rows,
    });
  };
}

function updatePrice() {
  return async (req, res) => {
    const rawData = _.pick(req.body, ['price']);
    const details = await CarModel.checkCarId(req.params.id);
    if (details.rowCount === 0) {
      return res.status(404).send({
        status: res.statusCode,
        message: 'not found',
      });
    }
    if (req.user.id !== details.rows[0].owner) {
      return res.status(401).send({
        status: res.statusCode,
        message: 'cannot perform this action',
      });
    }
    const updateResults = await CarModel.updatePrice(rawData.price, req.params.id);
    return res.send({
      status: res.statusCode,
      message: 'request was completed successfully',
      data: updateResults,
    });
  };
}

function updateStatus() {
  return async (req, res) => {
    const rawData = _.pick(req.body, ['status']);
    const details = await CarModel.checkCarId(req.params.id);
    if (details.rowCount === 0) {
      return res.status(404).send({
        status: res.statusCode,
        message: 'not found',
      });
    }
    if (req.user.id !== details.rows[0].owner) {
      return res.status(401).send({
        status: res.statusCode,
        message: 'cannot perform this action',
      });
    }
    const updateResults = await CarModel.updateStatus(rawData.status, req.params.id);
    return res.send({
      status: res.statusCode,
      message: 'request was completed successfully',
      data: updateResults,
    });
  };
}

function makeOrder() {
  return async (req, res) => {
    // pick the values from the users
    const rawData = _.pick(req.body, ['car_id', 'price_offered']);
    const results = validator.validateOrder(rawData);
    if (results.error === null) {
      const details = await CarModel.checkCarId(rawData.car_id);
      if (details.rowCount === 0) {
        return res.status(404).send({
          status: res.statusCode,
          message: 'car not found',
        });
      }
      const checkInfo = await CarModel.checkUserOrderExisting(
        parseInt(req.user.id, 10), details.rows[0].carid,
      );
      if (checkInfo.rowCount === 0) {
        // update data
        const data = await CarModel.makeOrder(rawData, req.user.id);
        return res.status(201).send({
          status: res.statusCode,
          message: 'request was completed successfully',
          data: data.rows[0],
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
      data: results.error.details[0].message,
    });
  };
}

function updateOrder() {
  return async (req, res) => {
    // pick the values from the users
    const { results, rawData } = validator.checkOrderUpdateDetails(req);
    if (results.error === null) {
      const details = await CarModel.checkOrder(req.params.id);
      if (details.rowCount === 0) {
        return res.status(404).send({
          status: res.statusCode,
          message: 'car not found or a deal was already made',
        });
      }
      const update = await CarModel.updateOrder(details.rows[0], rawData.new_price_offered);
      return res.status(200).send({
        status: res.statusCode,
        message: 'request was completed successfully',
        data: update,
      });
    }
    return res.status(400).send({
      status: res.statusCode,
      message: 'Something went wrong',
      data: results.error.details[0].message,
    });
  };
}

function deleteAD() {
  return async (req, res) => {
    const details = await CarModel.checkCarId(req.params.id);
    if (details.rowCount === 0) {
      return res.status(404).send({
        status: res.statusCode,
        message: 'not found',
      });
    }
    await CarModel.deleteCar(details.rows[0].carid);
    return res.status(200).send({
      status: res.statusCode,
      message: 'car Ad successfully deleted',
    });
  };
}

function getAll() {
  return async (req, res) => res.send({
    status: 200,
    message: 'request was completed successfully',
    data: await CarModel.getAllcars(),
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
