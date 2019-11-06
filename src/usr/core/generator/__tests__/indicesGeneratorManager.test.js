import path from 'path';
import * as indicesGeneratorManager from '../indicesGeneratorManager';
import { parseResource } from '../../parser/parserManager';
import * as projectManger from '../../project/projectManager';
import * as config from '../../config/config';
import * as projectResourcesManager from '../../project/projectResourcesManager';

it('noop', () => {});

// it('test makeImportFilePath', () => {
//   const filePath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app/src/usr/api/dumbs.js';
//   const importFilePath = makeImportFilePath(filePath, sourceDirPath, 'usr', 'app');
//   expect(importFilePath).toBe('usr/api/dumbs.js');
// });

// it('test makeIndexFileTree', async () => {
//   const dirPath = '/Users/ipselon/Development/projects/webcodesk/github/react-app-framework';
//   await config.initProjectPaths(dirPath);
//   initNewResourcesTrees();
//   const { resourceType, declarationsInFiles } = await parseResource(config.usrSourceDir);
//   console.info('Declarations In files: ', JSON.stringify(declarationsInFiles, null, 4));
//   updateResources(resourceType, declarationsInFiles);
//   // let functionsTree = getUserFunctionsTree();
//   // console.info('Functions: ', JSON.stringify(functionsTree, null, 4));
//   // const fileList =
//   //   makeIndexFileListByResourcesTree(functionsTree, path.join(config.appIndicesSourceDir, 'userFunctions'));
//   // if (fileList && fileList.length > 0) {
//   //   fileList.forEach(file => {
//   //     console.info(`File path: ${file.filePath} \n ${file.fileBody} \n\n`);
//   //   });
//   // }
//   // let componentsTree = getUserComponentsTree();
//   // console.info('Components: ', JSON.stringify(componentsTree, null, 4));
//   // let fileList =
//   //   makeIndexFileListByResourcesTree(componentsTree, path.join(config.appIndicesSourceDir, 'userComponents'));
//   // if (fileList && fileList.length > 0) {
//   //   fileList.forEach(file => {
//   //     console.info(`File path: ${file.filePath} \n ${file.fileBody} \n\n`);
//   //   });
//   // }
//   let componentStoriesTree = getUserComponentStoriesTree();
//   console.info('Stories: ', JSON.stringify(componentStoriesTree, null, 4));
//   let fileList =
//     makeIndexFileListByResourcesTree(componentStoriesTree, path.join(config.appIndicesSourceDir, 'userComponentStories'));
//   if (fileList && fileList.length > 0) {
//     fileList.forEach(file => {
//       console.info(`File path: ${file.filePath} \n ${file.fileBody} \n\n`);
//     });
//   }
//
// });

// it('test generateIndexFilesList', () => {
//   const sourceDirPath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app/test';
//   return parseSourceCodeFiles(path.join(sourceDirPath, 'usr'))
//     .then(declarationsInFiles => {
//       const indexFileTree = makeIndexFileTree(declarationsInFiles, sourceDirPath);
//       const fileList = generateIndexFilesList(indexFileTree, '/app/indices');
//       if (fileList && fileList.length > 0) {
//         fileList.forEach(file => {
//           console.info(`File path: ${file.filePath} \n ${file.fileBody} \n\n` );
//         });
//       }
//     });
// });

// it('test generateIndexFiles', () => {
//   const sourceDirPath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app/src';
//   const destDirPath = '/Users/ipselon/Development/projects/webcodesk/test/test-app-dir-in-the-project';
//   return parseSourceCodeFiles(path.join(sourceDirPath, 'usr'))
//     .then(declarationsInFiles => {
//       const indexFileTree = makeIndexFileTree(declarationsInFiles, sourceDirPath);
//       return generateIndexFiles(indexFileTree, destDirPath);
//     });
// });

// it('test makeIndexFileList2', async () => {
//   // const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app';
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/github/react-app-framework';
//   await config.initProjectPaths(projectDirPath);
//   initNewResourcesTrees();
//   const { resourceType, declarationsInFiles } = await parseResource(config.usrSourceDir);
//   updateResources(resourceType, declarationsInFiles);
//   let functionsTree = getUserFunctionsTree();
//   console.info('Functions: ', JSON.stringify(functionsTree, null, 4));
//   const fileList = makeIndexFileListByResourcesTree(functionsTree, path.join(config.appIndicesSourceDir, 'userFunctions'));
//   fileList.forEach(file => {
//     console.info('File path: ', file.filePath);
//     console.info('Body: ', file.fileBody);
//   });
//   // console.info('File list: ', JSON.stringify(fileList, null, 4));
// });

// it('test cleanIndicesDir', async () => {
//   // const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app';
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/test/hello_app';
//   await config.initProjectPaths(projectDirPath);
//   projectResourcesManager.initNewResourcesTrees();
//   const declarationsInFiles = await parseResource(config.usrSourceDir);
//   projectResourcesManager.updateResources(declarationsInFiles, () => false);
//
//   await projectManger.generateIndices();
//   // console.info('Another round of the creation');
//   // await projectManger.generateIndices();
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

