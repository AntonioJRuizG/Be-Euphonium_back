import { User } from './user.js';

export type Bombardino = {
  id: string;
  alias: string;
  manufacturer: string;
  model: string;
  valves: number;
  level: string;
  marchingBand: boolean;
  image: string;
  creator: User;
};
