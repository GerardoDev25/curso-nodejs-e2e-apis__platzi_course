const request = require('supertest');
const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { downSeed, upSeed } = require('./utils/umzug');

describe('test for /products path', () => {
  let app = null;
  let server = null;
  /** @type {import('supertest').SuperTest<import('supertest').Test>} */
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed();
  });

  describe('GET /products', () => {
    test('should return products', async () => {
      const { statusCode, body } = await api.get(`/api/v1/products`);
      const products = await models.Product.findAll();

      expect(statusCode).toEqual(200);
      expect(body.length).toEqual(products.length);
      expect(body[0].category).toBeTruthy();
    });

    test('should return products with pagination "limit = 2 offset = 0"', async () => {
      const limit = 2;
      const offset = 0;
      const { statusCode, body } = await api.get(
        `/api/v1/products?limit=${limit}&offset=${offset}`
      );

      expect(statusCode).toEqual(200);
      expect(body.length).toEqual(limit);
      expect(body[0].category).toBeTruthy();
    });
    test('should return products with pagination "limit = 2 offset = 2"',  async () => {
      const limit = 2;
      const offset = 2;
      const { statusCode, body } = await api.get(
        `/api/v1/products?limit=${limit}&offset=${offset}`
      );

      expect(statusCode).toEqual(200);
      expect(body.length).toEqual(limit);
      expect(body[0].category).toBeTruthy();
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
