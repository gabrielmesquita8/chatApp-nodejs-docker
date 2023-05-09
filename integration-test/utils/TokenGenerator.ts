import app from '../../src/server';
import request from 'supertest';

export class TokenGenerator {
    async generateToken() {
        const response = await request(app).post('/login').send({
        email: "robert.alonso@gmail.com", 
        password: "secret password"
        });
        const { token } = response.body
        return token
    }
}