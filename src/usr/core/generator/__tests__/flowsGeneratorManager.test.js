import * as config from '../../config/config';
import * as projectResourcesManager from '../../project/projectResourcesManager';
import { parseResource } from '../../parser/parserManager';
import * as projectManger from '../../project/projectManager';
import constants from '../../../commons/constants';
import * as flowsGeneratorManager from '../flowsGeneratorManager';
import { makeFileListByResourcesTree } from '../flowsGeneratorManager';

it('noop', () => {});

// it('test generate flow files', async () => {
//   // const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app';
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/github/react-app-framework';
//   await config.initProjectPaths(projectDirPath);
//   projectResourcesManager.initNewResourcesTrees();
//   const declarationsInFiles = await parseResource(config.etcFlowsSourceDir);
//   projectResourcesManager.updateResources(declarationsInFiles);
//
//   // omit root keys
//   const flowsStarterKey =
//     config.etcFlowsSourceDir.replace(`${config.projectRootSourceDir}${constants.FILE_SEPARATOR}`, '');
//   const flows = projectResourcesManager.getFlowsTree(flowsStarterKey);
//   // if we want to write flows files we have to write them into schema dir
//   // but before we need to get rid of the etc dir in the import paths of the flow resources
//   const replaceFlowsDirName =
//     `${constants.DIR_NAME_ETC}${constants.FILE_SEPARATOR}${constants.DIR_NAME_FLOWS}`;
//
//   let fileList = flowsGeneratorManager.makeFileListByResourcesTree(flows, config.appSchemaFlowsSourceDir, replaceFlowsDirName);
//
//   if (fileList && fileList.length > 0) {
//     fileList.forEach(fileItem => {
//       console.info('FileBody: ', fileItem.fileBody);
//     });
//   }
//
//   // let functionsTree = getUserFunctionsTree();
//   // console.info('Functions: ', JSON.stringify(functionsTree, null, 4));
//   // const fileList = makeIndexFileListByResourcesTree(functionsTree, path.join(config.appIndicesSourceDir, 'userFunctions'));
//   // fileList.forEach(file => {
//   //   console.info('File path: ', file.filePath);
//   //   console.info('Body: ', file.fileBody);
//   // });
//   // await indicesGeneratorManager.cleanIndicesDir(config.appIndicesSourceDir);
//
//   // console.info('File list: ', JSON.stringify(fileList, null, 4));
// });
