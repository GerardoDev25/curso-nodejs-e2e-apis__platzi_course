const request = require('supertest');
const createApp = require('../src/app');
const { models } = require('./../src/db/sequelize');

describe('test for /users path', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeEach(() => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
  });

  describe('GET /users', () => {
    test('should return a users', async () => {
      const inputId = 1;
      const user = await models.User.findByPk(inputId);

      const { statusCode, body } = await api.get(`/api/v1/users/${user.id}`);

      expect(statusCode).toEqual(200);
      expect(body.id).toEqual(user.id);
      expect(body.email).toEqual(user.email);
    });
  });

  describe('POST /users', () => {
    test('should return a 400 bad request "invalid password"', async () => {
      const inputData = {
        email: 'test@test.com',
        password: '----',
      };

      const { statusCode, body } = await api
        .post('/api/v1/users')
        .send(inputData);

      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/password/);
    });

    test('should return a 400 bad request "invalid email"', async () => {
      const inputData = {
        email: '----',
        password: '123456789',
      };

      const { statusCode, body } = await api
        .post('/api/v1/users')
        .send(inputData);

      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/email/);
    });

    // todo when the data is correct
  });

  describe('PUT /users', () => {
    // * test for users
  });

  afterEach(() => {
    server.close();
  });
});
