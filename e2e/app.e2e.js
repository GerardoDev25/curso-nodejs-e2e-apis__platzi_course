const experss = require('express');
const request = require('supertest');

const app = experss();

app.get('/hello', (req, res) => {
  res.status(200).json({ name: 'nico' });
});
app.listen(9000);
const api = request(app);

describe('test for app', () => {
  test('GET /hello', async () => {
    const response = await api.get('/hello');
    expect(response).toBeTruthy();
    expect(response.statusCode).toEqual(200);
    expect(response.body.name).toEqual('nico');
    expect(response.headers['content-type']).toMatch(/json/);
  });
});
