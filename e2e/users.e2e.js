const request = require('supertest');
const createApp = require('../src/app');
const { models } = require('./../src/db/sequelize');
const { downSeed, upSeed } = require('./utils/seed');

describe('test for /users path', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed();
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

    test('should return a new user', async () => {
      const inputData = {
        email: 'jonh@doe.com',
        password: 'jonhdoe123',
      };

      const { statusCode, body } = await api
        .post('/api/v1/users')
        .send(inputData);

      const user = await models.User.findByPk(body.id);

      expect(statusCode).toBe(201);
      expect(user).toBeTruthy();
      expect(user.role).toEqual('admin');
      expect(user.email).toEqual(inputData.email);
    });
  });

  describe('PUT /users', () => {
    // * test for users
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
