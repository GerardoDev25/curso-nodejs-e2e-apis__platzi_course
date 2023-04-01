const request = require('supertest');
const createApp = require('../src/app');

describe('test for /users path', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeEach(() => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
  });

  describe('GET /users', () => {});

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
  });

  describe('PUT /users', () => {
    // * test for users
  });

  afterEach(() => {
    server.close();
  });
});
