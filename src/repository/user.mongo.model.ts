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
  password: {
    type: String,
    requierd: true,
  },
  euphoniums: [{ type: Schema.Types.ObjectId, ref: 'Bombardino' }],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'usuarios');
