const request = require('supertest');

const { models } = require('../src/db/sequelize');
const createApp = require('../src/app');
const { upSeed, downSeed } = require('./utils/umzug');

describe('test for /categories path', () => {
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

  describe('POST /categories with a admin role', () => {
    beforeAll(async () => {
      const user = await models.User.findByPk('1');
      const inputData = {
        email: user.email,
        password: 'admin123',
      };

      const { body: bodyLogin } = await api
        .post('/api/v1/auth/login')
        .send(inputData);
      accessToken = bodyLogin.access_token;
    });

    test('should return 401', async () => {
      const inputData = {
        name: 'Categoria nueva',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
      };

      const { statusCode } = await api
        .post(`/api/v1/categories`)
        .send(inputData);

      expect(statusCode).toBe(401);
    });
    test('should return a new category', async () => {
      const inputData = {
        name: 'Categoria nueva',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
      };

      const { statusCode, body } = await api
        .post(`/api/v1/categories`)
        .send(inputData)
        .set({
          Authorization: `Bearer ${accessToken}`,
        });

      const dbCategory = await models.Category.findByPk(body.id);

      expect(statusCode).toBe(201);
      expect(dbCategory.name).toEqual(inputData.name);
      expect(dbCategory.image).toEqual(inputData.image);
    });
    afterAll(() => {
      accessToken = null;
    });
  });

  describe('POST /categories with a customer role', () => {
    beforeAll(async () => {
      const user = await models.User.findByPk('2');
      const inputData = {
        email: user.email,
        password: 'customer123',
      };

      const { body: bodyLogin } = await api
        .post('/api/v1/auth/login')
        .send(inputData);
      accessToken = bodyLogin.access_token;
    });

    test('should return 401 witout customer token', async () => {
      const inputData = {
        name: 'Categoria nueva',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
      };

      const { statusCode } = await api
        .post(`/api/v1/categories`)
        .send(inputData);

      expect(statusCode).toBe(401);
    });

    test('should return with a customer token', async () => {
      const inputData = {
        name: 'Categoria nueva',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
      };

      const { statusCode } = await api
        .post(`/api/v1/categories`)
        .send(inputData)
        .set({
          Authorization: `Bearer ${accessToken}`,
        });

      expect(statusCode).toBe(401);
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
