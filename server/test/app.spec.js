import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

const { expect } = chai;
const signupUrl = '/api/v1/auth/signup';
const loginUrl = '/api/v1/auth/signin';

chai.use(chaiHttp);

const regData = {
  email: 'jonathanaurugai12@gmail.com',
  first_name: 'Jonathan',
  last_name: 'Aurugai',
  password: 'Root1234',
  address: 'Kampala',
  is_admin: true,

};


describe('User', () => {
  describe('User create', () => {
    it('should return a new user with the supplied properties', (done) => {
      chai.request(server).post(signupUrl).send(regData).end((_err, res) => {
        console.log(res.body.message);
        expect(res.status).to.eq(201);
        done();
      });
    });
    it('should return error if all required fields are not supplied', (done) => {
      const data = {
        email: 'janedoe@gmail.com',
        first_name: 'jane',
        password: 'Root1234',
        address: 'kampala',
        phone: '0753688218',
      };
      chai.request(server).post(signupUrl).send(data).end((err, res) => {
        expect(res.status).to.eq(400);
        expect(res.body.data.name).to.eq('ValidationError');
        done();
      });
    });
  });
  describe('logging in the user', () => {
    it('should return a token and user details', () => {
      const data = {
        email: 'jonathanaurugai12@gmail.com',
        password: 'Root1234',
      };
      chai.request(server).post(loginUrl).send(data).then((res) => {
        expect(res.status).to.eq(200);
      })
        .catch((error) => {
          throw error;
        });
    });
  });
});
