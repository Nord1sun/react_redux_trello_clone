require('./config');
const app = require('../server');
const request = require('request');
const { User } = require('./../models');

describe('Login', () => {
  const apiUrl = 'http://localhost:3001/api/v1/sessions';
  let server;
  let user;

  beforeAll((done) => {
    server = app.listen(8888, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close();
    server = null;
    done();
  });

  beforeEach((done) => {
    User.create({
      fullName: 'Foo Bar',
      email: 'foobar@gmail.com',
      password: 'password1'
    })
      .then((result) => {
        user = result;
        done();
      })
      .catch(e => console.error(e.message));
  });

  it('returns a valid users token', (done) => {
    const body = { email: 'foobar@gmail.com', password: 'password1' };
    request({
      method: 'POST',
      url:`${ apiUrl }/new`,
      json: body
    }, (err, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body.token).toBeDefined();
      expect(body.data.id).toEqual(user.id);
      expect(body.data.fullName).toEqual(user.fullName);
      expect(body.data.email).toEqual(user.email);
      done();
    });
  });

  it('returns an invalid response for a unrecognized email', done => {
    const body = { email: 'foobar@notvalid.com', password: 'password1' };
    request({
      method: 'POST',
      url:`${ apiUrl }/new`,
      json: body
    }, (err, response, body) => {
      expect(response.statusCode).toBe(404);
      expect(body.token).not.toBeDefined();
      expect(body.data).not.toBeDefined();
      expect(body.message).toEqual('Invalid email/password');
      done();
    });
  });

  it('returns an invalid response for a wrong password', done => {
    const body = { email: 'foobar@gmail.com', password: 'invalid' };
    request({
      method: 'POST',
      url:`${ apiUrl }/new`,
      json: body
    }, (err, response, body) => {
      expect(response.statusCode).toBe(404);
      expect(body.token).not.toBeDefined();
      expect(body.data).not.toBeDefined();
      expect(body.message).toEqual('Invalid email/password');
      done();
    });
  });
});
