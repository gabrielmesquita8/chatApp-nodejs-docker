import app from '../src/server';
import request from 'supertest';
import { UserRepository } from "../src/repository/UserRepository";
import { TokenGenerator } from './utils/TokenGenerator';

const userReposiotry = new UserRepository()
const tokenGenerator = new TokenGenerator()
let token: string

beforeAll(async() => {
  await userReposiotry.cleanTable()

  await request(app)
  .post('/createAccount')
  .send({
    firstname: "Robert", 
    lastname:  "Alonso",
    email: "robert.alonso@gmail.com", 
    password: "secret password"
  });

  token = await tokenGenerator.generateToken()
})

describe('Validar criação de um novo usuário', () => {
  
  it('Dado que os campos sejam preenchidos corretamente, então deve ser retornado uma mensagem de sucesso junto com o status 201', async () => {
    const userData = {
      firstname: "Alonso", 
      lastname:  "Mendes",
      email: "alonso.mendes@gmail.com", 
      password: "secret password"
    }

    const response = await request(app)
    .post('/createAccount')
    .set("Content-Type", "application/json")
    .send(userData);
  
    const {firstname, lastname, email} = await userReposiotry.returnUserAccountByEmail(userData.email)

    expect([firstname, lastname, email]).toStrictEqual([userData.firstname, userData.lastname, userData.email])
    expect(response.status).toBe(201);
    expect(response.body).toBe("Usuário cadastrado com sucesso!")
  })

  it('Dado que os campos sejam preenchidos com dados incorretos, então deve ser retornado uma mensagem informando que houve um erro na requisição', async () => {
    const userData = {
      firstname: "131", 
      lastname:  "3131",
      email: "1313", 
      password: "secret"
    }

    const response = await request(app)
    .post('/createAccount')
    .set("Content-Type", "application/json")
    .send(userData);

    const verifyDB = await userReposiotry.returnUserAccountByEmail(userData.email)

    expect(verifyDB).toBe(null)
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: 'Verifique se os dados inseridos estão em um formato válido.' });
  })
})  

describe('Validar a operação de recuperar informações dos usuários', () => {
    it('Dado que o usuário seja válido, então deve ser retornado uma lista com todos os usuários', async () => {
      const response = await (await request(app)
      .get('/list-allUsersAccount')
      .set('Authorization', 'Bearer ' + token))

      // const verifyDB = await userReposiotry.returnAllUsersAccounts()

      // expect(verifyDB).toMatchObject(response.body)
      expect(response.status).toBe(200);
    })

    it('Dado que o email informado seja válido, então deve ser retornado as informações da conta do usuário', async () => {
      const response = await (await request(app)
      .get('/list-userEmail/robert.alonso@gmail.com')
      .set('Authorization', 'Bearer ' + token))

      expect(response.status).toBe(200);
    })
})