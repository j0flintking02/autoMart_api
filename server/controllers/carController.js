/* eslint-disable camelcase */
import multer from 'multer';
import validator from '../helpers/validation';
import CarModel from '../models/carModels';

const cloudinary = require('cloudinary').v2;
const _ = require('lodash');

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './uploads/');
  },
  filename(_req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname);
  },
});
const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 500 * 6,
  },
  fileFilter,
});

const carData = new CarModel();

function viewCarManager() {
  return (req, res) => {
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
    if (results.error !== null) {
      return res.status(400).send({
        status: res.statusCode,
        data: results.error,
      });
    }
    cloudinary.uploader.upload(`${req.file.destination}${req.file.filename}`, { tags: 'body_type' })
      .then((image) => {
        console.log();
        console.log('** File Upload (Promise)');
        console.log("* public_id for the uploaded image is generated by Cloudinary's service.");
        console.log(`* ${image.public_id}`);
        console.log(`* ${image.url}`);
        rawData.imgURL = image.url;
        // update data
        carData.addcarData(rawData, req);
      })
      .catch((err) => {
        console.log();
        console.log('** File Upload (Promise)');
        if (err) {
          console.warn(err);
        }
        return res.status(500).send({
          status: res.statusCode,
          data: 'Sorry something went worng while accessing cloudinary',
        });
      });
    return res.status(201).send({
      status: res.statusCode,
      message: 'Car AD has been created successfully',
      data: rawData,
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
      // update data
      carData.makeOrder(rawData, details);
      return res.status(201).send({
        status: res.statusCode,
        data: rawData,
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
  upload,
};
