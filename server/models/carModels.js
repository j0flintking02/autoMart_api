import moment from 'moment';

export default class CarModel {
  constructor() {
    this.cars = [
      {
        id: 1,
        owner: 2,
        state: 'used',
        status: 'sold',
        price: 200.1,
        manufacturer: 'audi',
        model: 'toyota',
        body_type: 'car',
        date_created: '2019-05-28T19:39:16+03:00',
      },
      {
        id: 2,
        owner: 2,
        state: 'used',
        status: 'available',
        price: 200.1,
        manufacturer: 'audi',
        model: 'mastung',
        body_type: 'car',
        date_created: '2019-05-28T19:39:16+03:00',
      },
      {
        id: 3,
        owner: 2,
        state: 'used',
        status: 'available',
        price: 200.1,
        manufacturer: 'audi',
        model: 'mastung',
        body_type: 'car',
        date_created: '2019-05-28T19:39:16+03:00',
      },
    ];
    this.orders = [
      {
        car_id: '5',
        price_offered: '1000',
        id: 1,
        date_created: '2019-05-29T00:15:16+03:00',
        status: 'available',
        price: '200',
        userId: 1,
      },
    ];
  }

  checkCarId(id) {
    return this.cars.find(car => car.id === parseInt(id, 10));
  }

  findAllAvialable() {
    return this.cars.filter(car => car.status === 'available');
  }

  checkCarstatus() {
    return this.cars.find(car => car.status === 'available');
  }

  deleteCar(details) {
    const index = this.cars.indexOf(details);
    this.cars.splice(index, 1);
  }

  getAllCars() {
    return this.cars;
  }

  updateOrder(details, rawData) {
    const oldData = details;
    this.update = {
      id: details.id,
      car_id: oldData.car_id,
      status: oldData.status,
      old_price_offered: oldData.price_offered,
      new_price_offered: rawData.new_price_offered,
    };
    // update data
    oldData.price_offered = rawData.new_price_offered;
    return this.update;
  }

  checkOrder(req) {
    return this.orders.find(order => order.car_id === req.params.id
        && order.status === 'available');
  }

  checkUserOrderExisting(id) {
    return this.orders.find(order => order.userId === id);
  }

  makeOrder(rawData, userId, details) {
    const input = rawData;
    input.id = this.orders.length + 1;
    input.date_created = moment().format();
    input.status = 'pending';
    input.price = details.price;
    input.userId = userId;
    // update the list of orders
    this.orders.push(input);
  }


  addcarData(rawData, req) {
    const input = rawData;
    input.id = this.cars.length + 1;
    input.owner = req.user.id;
    input.date_created = moment().format();
    // update the list of users
    this.cars.push(input);
  }

  getCarsInPriceRange(minPrice, maxPrice) {
    return this.cars.filter(
      elem => parseFloat(elem.price) >= parseFloat(minPrice)
        && parseFloat(elem.price) <= parseFloat(maxPrice),
    );
  }
}
