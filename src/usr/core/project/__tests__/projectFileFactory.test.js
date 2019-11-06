import * as config from 'usr/core/config/config';
import * as constants from 'usr/commons/constants';
import * as projectFileFactory from '../projectFileFactory';

it('noop', () => {});

// it('test createNewPageFileObject', async () => {
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/github/react-app-framework';
//   await config.initProjectPaths(projectDirPath);
//   const pageName = 'test';
//   const directoryName = 'probes';
//   const parentResourceObject = {
//     [constants.RESOURCE_IN_PAGES_TYPE]: {
//       type: constants.GRAPH_MODEL_DIR_TYPE,
//       key: `${constants.FILE_SEPARATOR}${constants.GRAPH_MODEL_DIR_ETC_PAGES_KEY}${constants.FILE_SEPARATOR}home`
//     }
//   };
//   const {filePath, fileData} =
//     projectFileFactory.createNewPageFileObject(pageName, directoryName, parentResourceObject);
//   console.info('File path: ', filePath);
//   console.info('File data: ', fileData);
// });