import config from 'config';
import express from 'express';
import cors from 'cors';
import users from './routers/users';
import cars from './routers/cars';

if (!config.get('db')) {
  console.log('FATAL ERROR: DATABASE_URL is not defined.');
  process.exit(1);
}
const app = express();
app.use(express.json());
app.use(cors());
// eslint-disable-next-line no-unused-vars
const env = require('env2')('./.env');

const port = process.env.PORT || 3000;

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}
app.use('/api/v1/auth/', users);
app.use('/api/v1/', cars);

app.use((err, req, res, next) => {
  res.status(500).send({
    status: res.statusCode,
    message: 'something went wrong',
  });
  return next();
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
