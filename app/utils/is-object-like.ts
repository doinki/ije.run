import { isNil } from './is-nil';

export function isObjectLike(value: unknown): value is object {
  return typeof value === 'object' && !isNil(value);
}
