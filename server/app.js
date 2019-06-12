import config from 'config';
import express from 'express';
import users from './routers/users';
import cars from './routers/cars';

const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const env = require('env2')('./.env');

const app = express();
app.use(express.json());


const port = process.env.PORT || 3000;

const dir = './uploads/';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}
app.use('/api/v1/auth/', users);
app.use('/api/v1/', cars);

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
