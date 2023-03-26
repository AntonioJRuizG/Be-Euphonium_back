import { model, Schema } from 'mongoose';
import { User } from '../entities/user.js';

const userSchema = new Schema<User>({
  name: {
    type: String,
    requiered: true,
    unique: true,
  },
  email: {
    type: String,
    requiered: true,
    unique: true,
  },
  pw: {
    type: String,
    requierd: true,
  },
  euphoniums: [{ type: Schema.Types.ObjectId, ref: 'euphonium' }],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.pw;
  },
});

export const UserModel = model('User', userSchema, 'usuarios');
