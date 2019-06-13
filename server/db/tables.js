// const db = require('./index');

const users = {
  create: `CREATE TABLE IF NOT EXISTS users (
    userId SERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password text NOT NULL,
    address VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL
);`,
  Insert: `
  INSERT INTO users (email, first_name, last_name, PASSWORD, 
    address, is_admin) VALUES ('janedoe@gmail.com',
      'Jane', 'Doe', '12345', 'Kampala', TRUE);
  `,
  Drop: 'DROP TABLE users CASCADE;',
};
const carads = {
  create: `
  CREATE TABLE IF NOT EXISTS carAds (
    carId SERIAL NOT NULL PRIMARY KEY,
    owner INTEGER REFERENCES users (userId) ON DELETE CASCADE NOT NULL,
    state VARCHAR(10) NOT NULL,
    status VARCHAR(10) NOT NULL,
    price FLOAT NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    body_type VARCHAR(255) NOT NULL,
    date_created VARCHAR(50) NOT NULL
);`,
  Insert: `
  INSERT INTO carads (owner, state, status, price, manufacturer,
    model, body_type, date_created) VALUES (1, 'used', 'available',
      200.1, 'audi', 'mastung', 'car', '2019-05-28T19:39:16+03:00');
  `,
  Drop: 'DROP TABLE carads CASCADE;',
};
const orders = {
  create: `
  CREATE TABLE IF NOT EXISTS orders (
    orderId SERIAL NOT NULL PRIMARY KEY,
    userId INTEGER REFERENCES users (userId) ON DELETE CASCADE NOT NULL,
    carId INTEGER REFERENCES carads (carId) ON DELETE CASCADE NOT NULL,
    status VARCHAR(10) NOT NULL,
    price_offered FLOAT NOT NULL,
    date_created VARCHAR(50) NOT NULL
);`,
  Insert: `
  INSERT INTO carads (owner, state, status, price, manufacturer,
    model, body_type, date_created) VALUES (1, 'used', 'available',
    200.1, 'audi', 'mastung', 'car', '2019-05-28T19:39:16+03:00');
  `,
  Drop: 'DROP TABLE orders CASCADE;',
};
module.exports = {
  users,
  carads,
  orders,
};
