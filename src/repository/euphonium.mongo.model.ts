import { model, Schema } from 'mongoose';
import { Euphonium } from '../entities/euphonium.js';

const euphoniumSchema = new Schema<Euphonium>({
  alias: {
    type: String,
    requiered: true,
    unique: true,
  },
  manufacturer: {
    type: String,
    requiered: true,
  },
  instrumentModel: {
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

euphoniumSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const EuphoniumModel = model(
  'Bombardino',
  euphoniumSchema,
  'bombardinos'
);
