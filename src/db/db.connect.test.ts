import mongoose from 'mongoose';
import { config } from '../config';
import { dbConnect } from './db.connetc';

jest.mock('mongoose');

describe('dbConnect', () => {
  it('should call mongoose.connect with the correct URI', async () => {
    const { user, password, cluster, dbName } = config;
    const uri = `mongodb+srv://${user}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

    await dbConnect();

    expect(mongoose.connect).toHaveBeenCalledWith(uri);
  });
});
