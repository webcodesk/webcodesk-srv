import path from 'path-browserify';
import { repairPath, writeFileWhenDifferent } from '../utils/fileUtils';
import constants from '../../../commons/constants';
import { getSchemaIndexFileText } from './fileTemplates';

export async function generateSchemaIndex(destDir) {
  const indexFilePath = repairPath(path.join(destDir, 'index.js'));
  const indexFileText = getSchemaIndexFileText({
    flowsDirName: constants.DIR_NAME_FLOWS,
    pagesDirName: constants.DIR_NAME_PAGES,
    routerFileName: constants.FILE_NAME_ROUTER
  });
  return writeFileWhenDifferent(indexFilePath, indexFileText)
    .catch(error => {
      console.error(`Can not write index file "${indexFilePath}" `, error);
    });
}