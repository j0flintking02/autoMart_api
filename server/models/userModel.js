import db from '../db/index';

const UserModel = {
  async checkuser(rawData) {
    const text = {
      // give the query a unique name
      name: 'fetch-user',
      text: 'SELECT * FROM users WHERE email = $1',
      values: [rawData.email],
    };
    // promise
    const data = await db.query(text)
      .then(res => res).catch(e => console.error(e.stack));
    return data;
  },
  async getDetails(rawData) {
    const text = {
      // give the query a unique name
      name: 'fetch-user',
      text: 'SELECT * FROM users WHERE email = $1',
      values: [rawData.email],
    };
    // promise
    const userData = await db.query(text)
      .then(res => res.rows[0]).catch(e => console.error(e.stack));
    return userData;
  },
  async addUser(rawData) {
    const text = 'INSERT INTO users(email, first_name, last_name, password, address, is_admin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [rawData.email, rawData.first_name,
      rawData.last_name, rawData.password, rawData.address, rawData.is_admin];
    const data = await db.query(text, values)
      .then(res => res.rows[0]).catch(e => console.error(e.stack));
    return data;
  },
  totalUsers() {
    const text = {
      // give the query a unique name
      name: 'total-users',
      text: 'select count (*) from users;',
    };
    // promise
    db.query(text)
      .then(res => console.log(res.rows[0]))
      .catch(e => console.error(e.stack));
  },
};
export default UserModel;
