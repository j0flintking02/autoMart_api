import helmet from 'helmet';
import compression from 'compression';

module.exports = (app) => {
  app.use(helmet);
  app.use(compression);
};
