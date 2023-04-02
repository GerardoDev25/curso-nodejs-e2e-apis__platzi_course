const request = require('supertest');
const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { downSeed, upSeed } = require('./utils/umzug');

describe('test for /profile path', () => {
  let app = null;
  let server = null;
  /** @type {import('supertest').SuperTest<import('supertest').Test>} */
  let api = null;
  let accessToken = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed();
  });

  describe('GET /my-user', () => {
    beforeAll(async () => {
      const inputData = {
        email: 'admin@mail.com',
        password: 'admin123',
      };

      const { body: bodyLogin } = await api
        .post('/api/v1/auth/login')
        .send(inputData);
      accessToken = bodyLogin.access_token;
    });

    test('should return a 401', async () => {
      const { statusCode } = await api.get('/api/v1/profile/my-user').set({
        Authorization: `Bearer 123`,
      });

      expect(statusCode).toEqual(401);
    });

    test('should return a user', async () => {
      const user = await models.User.findByPk(1);
      const { statusCode, body } = await api
        .get('/api/v1/profile/my-user')
        .set({
          Authorization: `Bearer ${accessToken}`,
        });

      expect(statusCode).toEqual(200);
      expect(body.email).toEqual(user.email);
    });

    afterAll(() => {
      accessToken = null;
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
