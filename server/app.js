
import express from 'express';
import users from './routers/users';

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use('/api/v1/auth/', users);

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
