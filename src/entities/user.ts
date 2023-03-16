import { Bombardino } from './bombardino.js';

export type User = {
  id: string;
  name: string;
  email: string;
  pw: string;
  bombardinos: Bombardino[];
};
