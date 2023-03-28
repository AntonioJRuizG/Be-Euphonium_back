import mongoose from 'mongoose';
import { config } from '../config';
import { dbConnect } from './db.connetc';

jest.mock('mongoose');

describe('Given dbConnect', () => {
  const { user, password, cluster, dbName } = config;
  describe('Given dbConnect', () => {
    test('Then should call mongoose.connect with the correct URI', async () => {
      const uri = `mongodb+srv://${user}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

      await dbConnect();

      expect(mongoose.connect).toHaveBeenCalledWith(uri);
      mongoose.disconnect();
    });

    test('Then should call mongoose.connect with the correct testing URI', async () => {
      process.env.NODE_ENV = 'Test';
      const dbTest = dbName + '-Testing';
      const uritest = `mongodb+srv://${user}:${password}@${cluster}/${dbTest}?retryWrites=true&w=majority`;
      await dbConnect();

      const result = await dbConnect();
      expect(typeof result).toBe(typeof mongoose);
      expect(mongoose.connect).toHaveBeenCalledWith(uritest);
      mongoose.disconnect();
    });
  });
});
