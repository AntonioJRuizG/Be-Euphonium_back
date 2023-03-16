import { Bombardino } from './bombardino';

export type User = {
  id: string;
  name: string;
  email: string;
  pw: string;
  bombardinos: Bombardino[];
};
