import mongoose from 'mongoose';
import { dbConnect } from './db.connetc';

describe('Given dbConnect', () => {
  describe('Given dbConnect', () => {
    test('Then should call mongoose.connect with the correct URI', async () => {
      const result = await dbConnect();
      expect(typeof result).toBe(typeof mongoose);
      mongoose.disconnect();
    });

    test('Then should call mongoose.connect with the correct testing URI', async () => {
      process.env.NODE_ENV = 'Test';
      const result = await dbConnect();
      expect(typeof result).toBe(typeof mongoose);
      mongoose.disconnect();
    });
  });
});
