import chai from 'chai';
import request from 'supertest';
import app from '../app'; // same app.ts

const { expect } = chai;
const api = request(app);

describe('Credential API Integration Tests', () => {
  const payload = {
    user_id: 'testuser1',
    credential: { type: 'certificate', name: 'B.Tech', userName: 'Test User' },
    issued_by: 'admin',
    status: 'issued',
  };

  it('should issue a new credential successfully', async () => {
    const res = await api.post('/api/credentials/issue').send(payload);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message').that.includes('issued');
    expect(res.body).to.have.property('id');
  });

  it('should not issue duplicate credentials', async () => {
    await api.post('/api/credentials/issue').send(payload);
    const res = await api.post('/api/credentials/issue').send(payload);
    expect(res.status).to.equal(409);
    expect(res.body).to.have.property('message').that.includes('already issued');
  });
});
