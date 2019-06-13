import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

const { expect } = chai;
const signupUrl = '/api/v1/auth/signup';
const loginUrl = '/api/v1/auth/signin';
const available = '/api/v1/car?status=available';

chai.use(chaiHttp);

const regData = {
  email: 'jonathanaurugai12@gmail.com',
  first_name: 'Jonathan',
  last_name: 'Aurugai',
  password: 'Root1234',
  address: 'Kampala',
  is_admin: true,

};
const regData1 = {
  email: 'adolfokanya@gmail.com',
  first_name: 'Adolf',
  last_name: 'Okanya',
  password: 'Root1234',
  address: 'Kampala',
  is_admin: false,

};

const carData = {
  state: 'used',
  status: 'available',
  price: '200',
  manufacturer: 'toyota',
  model: 'premio',
  body_type: 'car',
};


const userData = {
  email: 'jonathanaurugai12@gmail.com',
  password: 'Root1234',
};
let token;
let token1;

describe('main', () => {
  describe('test Users login and signup', () => {
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
        expect(res.body.message.name).to.eq('ValidationError');
        done();
      });
    });
    it('should return error if email already exists', (done) => {
      const data = {
        email: 'jonathanaurugai@gmail.com',
        first_name: 'jane',
        last_name: 'doe',
        password: 'Root1234',
        address: 'kampala',
        phone: '0753688218',
      };
      chai.request(server).post(signupUrl).send(data).end((err, res) => {
        expect(res.status).to.eq(409);
        done();
      });
    });
    it('should return a token and user details', () => {
      chai.request(server).post(loginUrl).send(userData).then((res) => {
        expect(res.status).to.eq(200);
      })
        .catch((error) => {
          throw error;
        });
    });
    it('should return 400 if email not found', () => {
      chai.request(server).post(loginUrl).send({
        email: 'janedoe@gmail.com',
        password: 'Root12345',
      }).then((res) => {
        expect(res.status).to.eq(400);
      })
        .catch((error) => {
          throw error;
        });
    });
    it('should return 400 if password entered is wrong', () => {
      chai.request(server).post(loginUrl).send({
        email: 'jonathanaurugai12@gmail',
        password: 'Root12345',
      }).then((res) => {
        expect(res.status).to.eq(400);
      })
        .catch((error) => {
          throw error;
        });
    });
    it('should return 400 if wrong details are entered', () => {
      chai.request(server).post(loginUrl).send({
        email: 'jonathanaurugai12@gmail',
        password: 'Sadan1234',
      }).then((res) => {
        expect(res.status).to.eq(400);
      })
        .catch((error) => {
          throw error;
        });
    });
  });
  describe('test routes that manage AD post', () => {
    before(async () => {
      const res = await chai.request(server).post(loginUrl)
        .send(userData);
      const res1 = await chai.request(server).post(signupUrl)
        .send(regData1);
      // eslint-disable-next-line prefer-destructuring
      token = res.body.data.token;
      token1 = res1.body.token;
      // eslint-disable-next-line no-underscore-dangle
      await chai.request(server).post('/api/v1/car').set('x-auth', token).send(carData);
    });
    describe('routes without authorisation', () => {
      it('should return all cars that are available', (done) => {
        chai.request(server).get(available).end((_err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.data[0]).to.have.property('id');
          done();
        });
      });
      it('should return an error when wrong parameter is used', async () => {
        const res = await chai.request(server).get('/api/v1/car?status=available2');
        expect(res.status).to.eq(400);
      });
      it('should return car within a specific price range', async () => {
        const res = await chai.request(server).get('/api/v1/car?min_price=200&max_price=300');
        expect(res.status).to.eq(200);
      });
      it('should return 404 if not found within a specific price range', async () => {
        const res = await chai.request(server).get('/api/v1/car?min_price=0&max_price=0');
        expect(res.status).to.eq(404);
      });
      it('should return 200 for getting a specific car', (done) => {
        chai.request(server).get('/api/v1/car/1').end((_err, res) => {
          expect(res.status).to.eq(200);
          done();
        });
      });
      it('should return 404 for getting a specific car that doesnot exist', (done) => {
        chai.request(server).get('/api/v1/car/150').end((_err, res) => {
          expect(res.status).to.eq(404);
          done();
        });
      });
      it('should 401 for unauthorised access', (done) => {
        chai.request(server).post('/api/v1/car').send(carData).end((_err, res) => {
          expect(res.status).to.eq(403);
          done();
        });
      });
    });
    describe('manage cars', () => {
      it('should return 400 for invalid input', (done) => {
        chai.request(server).post('/api/v1/car').set('x-auth', token).send({})
          .end((_err, res) => {
            expect(res.status).to.eq(400);
            done();
          });
      });
      it('should return 400 for invalid token', (done) => {
        chai.request(server).post('/api/v1/car').set('x-auth', 'token').send({})
          .end((_err, res) => {
            expect(res.status).to.eq(400);
            done();
          });
      });
      it('should return 201 for valid input', (done) => {
        chai.request(server).post('/api/v1/car').set('x-auth', token).send(carData)
          .end((_err, res) => {
            expect(res.status).to.eq(201);
            done();
          });
      });
      it('should return 200 for updating the price of a car', (done) => {
        chai.request(server).put('/api/v1/car/5/price').set('x-auth', token).send({ price: '200' })
          .end((_err, res) => {
            expect(res.status).to.eq(200);
            done();
          });
      });
      it('should return 404 for updating the price of a car that does not exist', (done) => {
        chai.request(server).put('/api/v1/car/15/price').set('x-auth', token).send({ price: '200' })
          .end((_err, res) => {
            expect(res.status).to.eq(404);
            done();
          });
      });
      it('should return 401 for updating the price of a car that is not theirs', (done) => {
        chai.request(server).put('/api/v1/car/1/price').set('x-auth', token).send({ price: '200' })
          .end((_err, res) => {
            expect(res.status).to.eq(401);
            done();
          });
      });

      it('should return 404 for updating the status of a car that does not exist', (done) => {
        chai.request(server).put('/api/v1/car/15/status').set('x-auth', token).send({ status: 'sold' })
          .end((_err, res) => {
            expect(res.status).to.eq(404);
            done();
          });
      });

      it('should return 200 for updating the status of a car', (done) => {
        chai.request(server).put('/api/v1/car/5/status')
          .set('x-auth', token).send({ status: 'sold' })
          .end((_err, res) => {
            expect(res.status).to.eq(200);
            done();
          });
      });

      it('should return 401 for updating the status of a car that is not theirs', (done) => {
        chai.request(server).put('/api/v1/car/1/status').set('x-auth', token).send({ status: 'sold' })
          .end((_err, res) => {
            expect(res.status).to.eq(401);
            done();
          });
      });
      it('should return 201 for creating an order', (done) => {
        chai.request(server).post('/api/v1/order').set('x-auth', token).send({
          car_id: '5',
          price_offered: '1000',
        })
          .end((_err, res) => {
            expect(res.status).to.eq(201);
            done();
          });
      });
      it('should return 400 for creating an order', (done) => {
        chai.request(server).post('/api/v1/order').set('x-auth', token).send({
          car_id: '5',
          price_offer: '1000',
        })
          .end((_err, res) => {
            expect(res.status).to.eq(400);
            done();
          });
      });
      it('should return 409 for creating an order', (done) => {
        chai.request(server).post('/api/v1/order').set('x-auth', token).send({
          car_id: '5',
          price_offered: '1000',
        });
        chai.request(server).post('/api/v1/order').set('x-auth', token).send({
          car_id: '5',
          price_offered: '1000',
        })
          .end((_err, res) => {
            expect(res.status).to.eq(409);
            done();
          });
      });
      it('should return 404 for creating an order for a car that does not exist', (done) => {
        chai.request(server).post('/api/v1/order').set('x-auth', token).send({
          car_id: '15',
          price_offered: '1000',
        })
          .end((_err, res) => {
            expect(res.status).to.eq(404);
            done();
          });
      });
      it('should return 200 for updating an order', (done) => {
        chai.request(server).put('/api/v1/order/5/price').set('x-auth', token).send({
          new_price_offered: '2000',
        })
          .end((_err, res) => {
            expect(res.status).to.eq(200);
            done();
          });
      });
      it('should return 400 for updating an order with errors', (done) => {
        chai.request(server).put('/api/v1/order/5/price').set('x-auth', token).send({
          new_price_offered2: '2000',
        })
          .end((_err, res) => {
            expect(res.status).to.eq(400);
            done();
          });
      });
      it('should return 404 for updating an order for a car that does not exit', (done) => {
        chai.request(server).put('/api/v1/order/12/price').set('x-auth', token).send({
          new_price_offered: '2000',
        })
          .end((_err, res) => {
            expect(res.status).to.eq(404);
            done();
          });
      });
      it('should return 200 for deleting a car', (done) => {
        chai.request(server).delete('/api/v1/car/1').set('x-auth', token)
          .end((_err, res) => {
            expect(res.status).to.eq(200);
            done();
          });
      });
      it('should return 403 for deleting a car when you are not an admin', (done) => {
        chai.request(server).delete('/api/v1/car/1').set('x-auth', token1)
          .end((_err, res) => {
            expect(res.status).to.eq(403);
            expect(res.body.message).to.eq('Access denied');
            done();
          });
      });
      it('should return 404 for deleting a car that does not exist', (done) => {
        chai.request(server).delete('/api/v1/car/12').set('x-auth', token)
          .end((_err, res) => {
            expect(res.status).to.eq(404);
            done();
          });
      });
      it('should return 200 for getting sold and unsold cars', (done) => {
        chai.request(server).get('/api/v1/all').set('x-auth', token)
          .end((_err, res) => {
            expect(res.status).to.eq(200);
            done();
          });
      });
    });
  });
});
