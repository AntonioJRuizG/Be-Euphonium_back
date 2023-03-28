import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../db/db.connetc';
import { UserModel } from '../repository/user.mongo.model';
import { EuphoniumModel } from '../repository/euphonium.mongo.model';
import { Auth, PayloadToken } from '../services/auth';

describe('Given an App, with user route', () => {
  const setUpUser = async () => {
    const mockUsers = [
      {
        name: 'Lorena20',
        email: 'lorena@gmail.com',
        password: await Auth.hash('1234'),
      },
      {
        name: 'Joseba',
        email: 'joseba@gmail.com',
        password: await Auth.hash('1234'),
      },
    ];

    await UserModel.deleteMany().exec();
    await UserModel.insertMany(mockUsers);
    const dataUser = await UserModel.find().exec();
    const userIds = [dataUser[0].id, dataUser[1].id];
    return userIds;
  };

  let userIds: Array<string>;

  const setUpEuphonium = async () => {
    const mockEuphonium = [
      {
        alias: 'Alias-Name-Test-1',
        manufacturer: 'Manufacturer-Name-Test-1',
      },
      {
        alias: 'Alias-Name-Test-2',
        manufacturer: 'Manufacturer-Name-Test-2',
      },
    ];
    await EuphoniumModel.deleteMany().exec();
    await EuphoniumModel.insertMany(mockEuphonium);

    const data = await EuphoniumModel.find().exec();
    const euphoniumsIds = [data[0].id, data[1].id];
    return euphoniumsIds;
  };

  let token: string;
  let euphoniumsIds: Array<string>;

  beforeAll(async () => {
    await dbConnect();
    userIds = await setUpUser();
    euphoniumsIds = await setUpEuphonium();
    const payload: PayloadToken = {
      id: userIds[0],
      name: 'Lorena20',
      email: 'lorena@gmail.com',
      role: 'Admin',
    };

    token = Auth.createJWT(payload);
  });

  describe('When we use post to the url /ususerio/registro', () => {
    test('Then it should send a status 200', async () => {
      const response = await request(app).post('/usuarios/registro').send({
        name: 'Lorena21',
        email: 'lorena2@gmail.com',
        password: '1234',
      });
      expect(response.status).toBe(201);
    });

    test('Then it should send a status 401 Unauthorized if no user is send', async () => {
      const response = await request(app).post('/usuarios/registro/');
      expect(response.status).toBe(401);
    });
  });

  describe('When we use post to the url /usuarios/acceso', () => {
    test('Then it should send a status 202 if user is registered', async () => {
      const newUser = {
        email: 'lorena@gmail.com',
        password: '1234',
      };
      const response = await request(app)
        .post('/usuarios/acceso')
        .send(newUser);
      expect(response.status).toBe(202);
    });

    test('Then it should send a status 401 if user is not already in the data base', async () => {
      const response = await request(app).post('/usuarios/acceso');
      expect(response.status).toBe(401);
    });
  });

  // Euphoniums //

  describe('When we use get to the url /', () => {
    test('Then it should send a status 200', async () => {
      await request(app).get('/').expect(200);
    });

    test('If the endpoint is wrong, it should send a 404 status', async () => {
      await request(app).get('/bombard').expect(404);
    });
  });

  describe('When we use get to the url /bombardinos/', () => {
    test('Then it should send a status 200', async () => {
      await request(app).get('/bombardinos').expect(200);
    });
  });

  describe('When we use get to the url /bombardinos/?offset=1', () => {
    test('Then it should send a status 200', async () => {
      const response = await request(app).get('/bombardinos/?offset=1');
      expect(response.status).toBe(200);
    });

    test('If the endpoint is invalid, it should send a status 500', async () => {
      const response = await request(app).get('/bombardinos/?offset=');
      expect(response.status).toBe(500);
    });
  });

  describe('When we use get to the url bombardinos/filter?offset=1&valves=4', () => {
    test('Then it should send a status 200', async () => {
      const response = await request(app).get(
        '/bombardinos/filter?offset=1&valves=4'
      );
      expect(response.status).toBe(200);
    });
  });

  describe('When we use get to the url /bombardinos/:id', () => {
    test('Then it should send a status 200', async () => {
      const response = await request(app).get(
        `/bombardinos/${euphoniumsIds[0]}`
      );
      expect(response.status).toBe(200);
    });

    test('If the id is invalid, it should send a status 400', async () => {
      const response = await request(app).get(
        `/bombardinos/${euphoniumsIds[9]}`
      );
      expect(response.status).toBe(400);
    });
  });

  describe('When we use post to the url /bombardinos/', () => {
    test('If the token is invalid, it should send a status 500', async () => {
      const response = await request(app)
        .post('/bombardinos/')
        .set('Authorization', `Bearer `)
        .send({
          alias: 'Test-Add',
        });
      expect(response.status).toBe(500);
    });
    test('If the token is valid, it should send a status 200', async () => {
      const response = await request(app)
        .post('/bombardinos/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          alias: 'Test-Add',
        });
      expect(response.status).toBe(200);
    });
  });

  describe('When we use patch to the url bombardinos/:id', () => {
    test('If the token is invalid, it should send a status 500', async () => {
      const response = await request(app)
        .patch(`/bombardinos/${euphoniumsIds[0]}`)
        .set('Authorization', `Bearer worng-token`)
        .send({
          id: euphoniumsIds[0],
        });
      expect(response.status).toBe(500);
    });
    test('If the token is valid, it should send a status 500', async () => {
      const response = await request(app)
        .patch(`/bombardinos/${euphoniumsIds[0]}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: euphoniumsIds[0],
        });
      expect(response.status).toBe(500);
    });
  });

  describe('When we use delete to the url bombardinos/:id', () => {
    test('If the token is invalid, it should send a status 500', async () => {
      const response = await request(app)
        .delete(`/bombardinos/${euphoniumsIds[0]}`)
        .set('Authorization', `Bearer worng-token`)
        .send({
          id: euphoniumsIds[0],
        });
      expect(response.status).toBe(500);
    });
    test('If the token is valid, it should send a status 500', async () => {
      const response = await request(app)
        .delete(`/bombardinos/${euphoniumsIds[0]}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: euphoniumsIds[0],
        });
      expect(response.status).toBe(500);
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
