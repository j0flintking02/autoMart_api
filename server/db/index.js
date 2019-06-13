const config = require('config');
const { Client } = require('pg');

if (!config.get('db')) {
  console.log('FATAL ERROR: DATABASE_URL is not defined.');
  process.exit(1);
}
const connectionString = config.get('db');

const client = new Client({
  connectionString,
});
client.connect();

// eslint-disable-next-line no-unused-vars
client.query('SELECT NOW()', (err, res) => {
  console.log('Database connected 1');
});

module.exports = {
  query: (text, params, callback) => client.query(text, params, callback),
};
