const request = require('supertest');
const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');

describe('test for /auth path', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(() => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
  });

  describe('POST /auth', () => {
    test('should return a 401', async () => {
      const inputData = {
        email: 'test@fake.com',
        password: '123456789',
      };

      const { statusCode } = await api
        .post('/api/v1/auth/login')
        .send(inputData);

      expect(statusCode).toEqual(401);
    });

    test('should return a 200', async () => {
      const inputData = {
        email: 'admin@mail.com',
        password: 'admin123',
      };
      const user = await models.User.findByPk(1);

      const { statusCode, body } = await api
        .post('/api/v1/auth/login')
        .send(inputData);

      expect(statusCode).toEqual(200);
      expect(body.access_token).toBeTruthy();
      expect(body.user.password).not.toBeTruthy();
      expect(body.user.email).toEqual(user.email);
    });
  });

  afterAll(() => {
    server.close();
  });
});
