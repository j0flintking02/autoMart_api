import moment from 'moment';
import db from '../db/index';

const CarModel = {
  async checkCarId(id) {
    const text = {
      name: 'fetch-car-by-id',
      text: 'SELECT * FROM carads WHERE carid = $1',
      values: [parseInt(id, 10)],
    };
    const data = await db.query(text)
      .then(res => res).catch(e => console.error(e.stack));
    return data;
  },
  async findAllAvialable() {
    const status = 'available';
    const text = {
      name: 'fetch-available-cars',
      text: 'SELECT * FROM carads WHERE status = $1',
      values: [status],
    };

    const data = await db.query(text)
      .then(res => res).catch(e => console.error(e.stack));
    return data;
  },
  async getCarsInPriceRange(minPrice, maxPrice) {
    const status = 'available';
    const text = {

      name: 'fetch-available-cars-within-price-range',
      text: 'SELECT * FROM carads WHERE carads.price BETWEEN $1 AND $2 AND status = $3;',
      values: [minPrice, maxPrice, status],
    };

    const data = await db.query(text)
      .then(res => res).catch(e => console.error(e.stack));
    return data;
  },
  async addCar(rawData, req) {
    const text = 'INSERT INTO carads (owner, state, status, price, manufacturer, model, body_type, date_created)'
     + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const values = [req.user.id, rawData.state, rawData.status,
      rawData.price, rawData.manufacturer, rawData.model, rawData.body_type,
      moment().format()];
    const data = await db.query(text, values)
      .then(res => res.rows[0]).catch(e => console.error(e.stack));
    return data;
  },
  async updatePrice(price, id) {
    const text = 'UPDATE carads SET price = $1 WHERE carId = $2 RETURNING *';
    const values = [price, id];
    const data = await db.query(text, values)
      .then(res => res.rows[0]).catch(e => console.error(e.stack));
    return data;
  },
  async updateStatus(status, id) {
    const text = 'UPDATE carads SET status = $1 WHERE carId = $2 RETURNING *';
    const values = [status, id];
    const data = await db.query(text, values)
      .then(res => res.rows[0]).catch(e => console.error(e.stack));
    return data;
  },
  async checkUserOrderExisting(userId, carId) {
    const text = {
      name: 'fetch-order-by-id',
      text: 'SELECT * FROM orders WHERE userId = $1 AND carId = $2',
      values: [parseInt(userId, 10), carId],
    };
    const data = await db.query(text)
      .then(res => res).catch(e => console.error(e.stack));
    return data;
  },
  async makeOrder(rawData, userId) {
    const text = 'INSERT INTO orders (userId, carId, status, price_offered, date_created)'
     + 'VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [userId, rawData.car_id, 'pending', rawData.price_offered, moment().format()];
    const data = await db.query(text, values)
      .then(res => res).catch(e => console.error(e.stack));
    return data;
  },
  async checkOrder(id) {
    const status = 'pending';
    const text = {
      name: 'check-car-order-by-id',
      text: 'SELECT * FROM orders WHERE carid = $1 AND status = $2',
      values: [parseInt(id, 10), status],
    };

    const data = await db.query(text)
      .then(res => res).catch(e => console.error(e.stack));
    return data;
  },
  async updateOrder(details, offer) {
    const text = 'UPDATE orders SET price_offered = $1 WHERE carId = $2 RETURNING *';
    const values = [parseFloat(offer), details.carid];
    const data = await db.query(text, values)
      .then(res => res.rows[0]).catch(e => console.error(e.stack));
    return data;
  },
  async deleteCar(id) {
    const text = {
      name: 'delete-car-by-id',
      text: 'DELETE FROM carads WHERE carid = $1;',
      values: [parseInt(id, 10)],
    };
    const data = await db.query(text)
      .then(res => res).catch(e => console.error(e.stack));
    return data;
  },
  async getAllcars() {
    const text = {
      name: 'fetch-all-cars',
      text: 'SELECT * FROM carads',
    };
    const data = await db.query(text)
      .then(res => res).catch(e => console.error(e.stack));
    return data.rows;
  },
};
export default CarModel;
