import { isAxiosError } from 'axios';
import type { ApiResponse } from '../types/api';

export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (isAxiosError<ApiResponse<unknown>>(err)) {
    if (!err.response) {
      return 'Unable to reach the server';
    }
    return err.response.data?.message ?? fallback;
  }
  return fallback;
}