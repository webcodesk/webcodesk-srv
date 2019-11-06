import { repairPath, isExisting } from '../utils/fileUtils';

export async function checkFileExists(resourcePath) {
  const validResourcePath = repairPath(resourcePath);
  try {
    await isExisting(validResourcePath);
    return true;
  } catch (e) {
    return false;
  }
}
