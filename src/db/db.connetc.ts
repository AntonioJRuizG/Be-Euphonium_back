import mongoose from 'mongoose';
import { config } from '../config.js';

const { user, password, cluster, dbName } = config;

export const dbConnect = (env?: string) => {
  const envResult = env || process.env.NODE_ENV;
  const dbResult = envResult === 'test' ? dbName + '-Testing' : dbName;

  const uri = `mongodb+srv://${user}:${password}@${cluster}/${dbResult}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
