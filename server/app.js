import config from 'config';
import express from 'express';
import users from './routers/users';
import cars from './routers/cars';

// eslint-disable-next-line no-use-before-define
// require('../startup/prod')(app);


const app = express();
app.use(express.json());
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
  res.status(500).send('something went wrong');
  return next();
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
