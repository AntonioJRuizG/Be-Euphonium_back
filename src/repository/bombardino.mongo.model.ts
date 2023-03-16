import { model, Schema } from 'mongoose';
import { Bombardino } from '../entities/bombardino.js';

const bombardinoSchema = new Schema<Bombardino>({
  alias: {
    type: String,
    requiered: true,
    unique: true,
  },
  manufacturer: {
    type: String,
    requiered: true,
  },
  model: {
    type: String,
    requiered: true,
  },
  valves: {
    type: Number,
    requierd: false,
  },
  level: {
    type: String,
    requiered: false,
  },
  marchingBand: {
    type: Boolean,
    requiered: false,
  },
  image: {
    type: String,
    requiered: false,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

bombardinoSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const BombardinoModel = model(
  'Bombardino',
  bombardinoSchema,
  'bombardinos'
);
