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

  await request(app)
  .post('/createAccount')
  .send({
    firstname: "Felipe", 
    lastname:  "Oliveira",
    email: "felipe.oliveira@gmail.com", 
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

      expect(response.status).toBe(200);
    })

    it('Dado que o email informado seja válido, então deve ser retornado as informações da conta do usuário', async () => {
      const response = await (await request(app)
      .get('/list-userEmail/robert.alonso@gmail.com')
      .set('Authorization', 'Bearer ' + token))

      expect(response.status).toBe(200);
    })
})

describe('Validar operações de trocar informações de email e senha', () => {

  it('Dado que os campos sejam preenchidos com dados corretos, então deve ser alterado o campo email com sucesso', async () => {
  
    const beforeChange = await userReposiotry.returnUserAccountByEmail('robert.alonso@gmail.com')
    const userData = {
      email: 'otherEmail@gmail.com'
    }

    const response = await request(app)
    .patch('/changeEmail/robert.alonso@gmail.com')
    .set('Authorization', 'Bearer ' + token)
    .set("Content-Type", "application/json")
    .send(userData);

    const verifyDB = await userReposiotry.returnUserAccountByEmail(userData.email)

    expect(beforeChange.firstname).toBe(verifyDB.firstname)
    expect(beforeChange.lastname).toBe(verifyDB.lastname)
    expect(beforeChange.password).toBe(verifyDB.password)

    expect(verifyDB.email).toBe(userData.email)
    expect(response.status).toBe(200);
    expect(response.body).toBe('Email Alterado com sucesso!');
  })

  it('Dado que os campos sejam preenchidos com dados corretos, então deve ser alterado o campo senha com sucesso', async () => {
  
    const beforeChange = await userReposiotry.returnUserAccountByEmail('felipe.oliveira@gmail.com')
    const userData = {
      password: 'new password'
    }

    const response = await request(app)
    .patch('/changePassword/felipe.oliveira@gmail.com')
    .set('Authorization', 'Bearer ' + token)
    .set("Content-Type", "application/json")
    .send(userData);

    const verifyDB = await userReposiotry.returnUserAccountByEmail(beforeChange.email)

    expect(beforeChange.firstname).toBe(verifyDB.firstname)
    expect(beforeChange.lastname).toBe(verifyDB.lastname)
    expect(beforeChange.email).toBe(verifyDB.email)

    expect(verifyDB.email).not.toBe(beforeChange.password)
    expect(response.status).toBe(200);
    expect(response.body).toBe('Senha Alterada com sucesso!');
  })
}) 

describe('Validar operações de excluir a conta do usuário', () => {
  it('Dado que o email informado esteja correto, então  o usuário deve ser excluido com sucesso', async () => {
  
    const userData = {
      password: 'new password'
    }

    const response = await request(app)
    .delete('/deleteAccount/felipe.oliveira@gmail.com')
    .set('Authorization', 'Bearer ' + token)
    .set("Content-Type", "application/json")
    .send(userData);

    const verifyDB = await userReposiotry.returnUserAccountByEmail('felipe.oliveira@gmail.com')

    expect(verifyDB).toBe(null)
    expect(response.status).toBe(200);
    expect(response.body).toBe('Sua conta foi deletada com sucesso');
  })
})