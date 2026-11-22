import type { Policy } from './policy';

export interface Profile {
  customerId: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  policies: Policy[];
}