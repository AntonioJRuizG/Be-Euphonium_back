import { User } from './user.js';

export type Bombardino = {
  id: string;
  alias: string;
  manufacturer: string;
  instrumentModel: string;
  valves: number;
  level: string;
  marchingBand: boolean;
  image: string;
  creator: User;
};
