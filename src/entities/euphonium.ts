import { User } from './user.js';

export type Euphonium = {
  id: string;
  alias: string;
  manufacturer: string;
  instrumentModel: string;
  valves: number;
  material: string;
  marchingBand: boolean;
  image: string;
  creator: User;
};
