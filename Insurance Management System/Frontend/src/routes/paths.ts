import type { Role } from '../types/auth';

export const homePath = (role: Role): string =>
  role === 'ADMIN' ? '/admin' : '/customer/profile';