import { Euphonium } from './euphonium.js';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  euphoniums: Euphonium[];
};
