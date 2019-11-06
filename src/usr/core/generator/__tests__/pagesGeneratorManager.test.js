import * as projectResourcesManager from '../../project/projectResourcesManager';
import * as config from '../../config/config';
import * as parserManager from '../../parser/parserManager';
import * as projectFilesManager from '../../project/projectFilesManager';
import constants from '../../../commons/constants';
import * as pagesGeneratorManager from '../pagesGeneratorManager';
import { appSchemaInitialStateFile } from '../../config/config';
import { readJson } from '../../utils/fileUtils';

it('noop', () => {});

// it('test makeIndexFileListByResourcesTree', async () => {
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/test/hello_app';
//   await config.initProjectPaths(projectDirPath);
//   projectResourcesManager.initNewResourcesTrees();
//   const declarationsInFiles = await parserManager.parseResource(config.etcPagesSourceDir);
//
//   // console.info('Read declarations in files: ', declarationsInFiles);
//   // const updatedDeclarationsInFiles = projectFilesManager.updateDeclarationsInFiles(declarationsInFiles);
//   // console.info('Declarations in files: ', JSON.stringify(declarationsInFiles, null, 4));
//
//   const { updatedResources, deletedResources } =
//     projectResourcesManager.updateResources(declarationsInFiles, () => {return true});
//
//   // console.info('Updated resources: ', JSON.stringify(updatedResources, null, 4));
//   // let functionsTree = getUserFunctionsTree();
//   // console.info('Functions: ', JSON.stringify(functionsTree, null, 4));
//   // let componentsTree = getUserComponentsTree();
//   // console.info('Components: ', JSON.stringify(componentsTree, null, 4));
//   // let componentStoriesTree = getUserComponentStoriesTree();
//   // console.info('Stories: ', JSON.stringify(componentStoriesTree, null, 4));
//   // let pagesTree = projectResourcesManager.getPagesTree();
//   // console.info('Pages: ', JSON.stringify(pagesTree, null, 4));
//
//   const starterKey = config.etcPagesSourceDir.replace(`${config.projectRootSourceDir}${constants.FILE_SEPARATOR}`, '');
//   console.info('Starter key for pages tree: ', starterKey);
//   let pagesTree = projectResourcesManager.getPagesTree(starterKey);
//   console.info('Pages: ', JSON.stringify(pagesTree, null, 4));
//
//   // const replaceDirName =
//   //   `${constants.DIR_NAME_ETC}${constants.FILE_SEPARATOR}${constants.DIR_NAME_PAGES}${constants.FILE_SEPARATOR}`;
//   // const replaceDirName =
//   //   `${constants.DIR_NAME_ETC}${constants.FILE_SEPARATOR}${constants.DIR_NAME_PAGES}`;
//   // console.info('config.appSchemaPagesSourceDir: ', config.appSchemaPagesSourceDir);
//   // console.info('replaceDirName: ', replaceDirName);
//   // let fileList =
//   //   pagesGeneratorManager.makeIndexFileListByResourcesTree(pagesTree, config.appSchemaPagesSourceDir, replaceDirName);
//   // if (fileList && fileList.length > 0) {
//   //   fileList.forEach(file => {
//   //     console.info('filePath: ', file.filePath);
//   //     console.info('fileBody: ', file.fileBody);
//   //   });
//   // }
//   // fileList =
//   //   pagesGeneratorManager.makeFileListByResourcesTree(pagesTree, config.appSchemaPagesSourceDir, replaceDirName);
//   // if (fileList && fileList.length > 0) {
//   //   fileList.forEach(file => {
//   //     console.info('filePath: ', file.filePath);
//   //     console.info('fileBody: ', file.fileBody);
//   //   });
//   // }
//   // const routerItems = pagesGeneratorManager.makeRouterItemsData(pagesTree, replaceDirName);
//   // console.info('Router Items: ', JSON.stringify(routerItems, null, 2));
//
//   pagesGeneratorManager.generateInitialStateFile(pagesTree, config.appSchemaInitialStateFile);
//
// });

// it('build the page component', () => {
//   // const filePath = '/Users/ipselon/Development/projects/webcodesk/test/probe_typescript_project/src/usr/TitlePanel.tsx';
//   // const destFilePath = '/Users/ipselon/Development/projects/webcodesk/test/probe_typescript_project/src/usr/TitlePanel.tsx.json';
//   // const filePath = '/Users/ipselon/Development/projects/webcodesk/test/probe_typescript_project/src/usr/types/TitlePanel.d.ts';
//   // const destFilePath = '/Users/ipselon/Development/projects/webcodesk/test/probe_typescript_project/src/usr/types/TitlePanel.d.ast.json';
//   // const filePath = '/Users/ipselon/Development/projects/webcodesk/test/framework_probe_v_2_0/src/usr/probe/components/ProbeLayer.tsx';
//   // const destFilePath = '/Users/ipselon/Development/projects/webcodesk/test/framework_probe_v_2_0/src/usr/probe/ProbeLayer.tsx.ast.json';
//   const validPath = './componentsTree.json';
//   return readJson(`${__dirname}/${validPath}`)
//     .then(fileData => {
//       const pageComponentModel = pagesGeneratorManager.createComponentsTree(fileData);
//       console.info(JSON.stringify(pageComponentModel, null, 4));
//     })
//     .catch(error => {
//       console.error(error);
//     })
// });