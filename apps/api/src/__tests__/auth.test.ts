import request from 'supertest';
import app from '../server.js';

describe('Auth endpoints', () => {
  it('rechaza login sin datos', async () => {
    const response = await request(app).post('/api/auth/login').send({});
    expect(response.status).toBe(400);
  });
});
