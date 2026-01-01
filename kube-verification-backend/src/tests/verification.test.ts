import chai from 'chai';
import request from 'supertest';
import app from '../app';

const { expect } = chai;
const api = request(app);

describe('Verification API Integration Tests', () => {
  const validPayload = {
    credential: {
      user_id: '75',
      type: 'badge',
      name: 'Actor',
      userName: 'Salman Khan'
    }
  };

  it('should verify a valid credential and return worker_id and issued_at', async () => {
    const res = await api.post('/api/verification/check').send(validPayload);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('worker_id', validPayload.credential.user_id);
    expect(res.body).to.have.property('issued_at').that.is.a('string'); // ISO date string
  });

  it('should return 400 for missing credential in body', async () => {
    const res = await api.post('/api/verification/check').send({});

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.includes('Missing credential data');
  });

  it('should return 404 for invalid or non-existent credential', async () => {
    const invalidPayload = {
      credential: {
        user_id: '9999',
        type: 'badge',
        name: 'Actor',
        userName: 'Non Existent User'
      }
    };

    const res = await api.post('/api/verification/check').send(invalidPayload);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('message').that.includes('Credential not found or invalid');
  });
});
