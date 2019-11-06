import { invokeServer } from './serverUtils';

export function readDir(path) {
  return invokeServer('readDir', path);
}
