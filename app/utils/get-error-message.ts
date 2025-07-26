import { isObjectLike } from './is-object-like';

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error;
  }

  if (isObjectLike(error) && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return 'An unexpected error occurred.';
}
