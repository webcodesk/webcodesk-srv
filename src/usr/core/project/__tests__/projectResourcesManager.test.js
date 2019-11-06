import {
  initNewResourcesTrees,
  updateResources,
  getUserFunctionsTree,
  getUserComponentsTree,
  getUserComponentStoriesTree,
  getPagesTree,
  getPropTypesTree
} from '../projectResourcesManager';
import * as config from '../../config/config';
import { parseResource } from '../../parser/parserManager';
import * as projectResourcesUtils from '../projectResourcesUtils';

it('noop', () => {});

// it('test updateResources', async () => {
//   // const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app';
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/github/react-app-framework';
//   await config.initProjectPaths(projectDirPath);
//   initNewResourcesTrees();
//   const declarationsInFiles = await parseResource(config.usrSourceDir);
//   // console.info('Declaration in files: ', declarationsInFiles);
//   updateResources(declarationsInFiles);
//   let functionsTree = getUserFunctionsTree();
//   console.info('Functions: ', JSON.stringify(functionsTree, null, 4));
//
//   // let componentsTree = getUserComponentsTree();
//   // console.info('Components: ', JSON.stringify(componentsTree, null, 4));
//   // let componentStoriesTree = getUserComponentStoriesTree();
//   // console.info('Stories: ', JSON.stringify(componentStoriesTree, null, 4));
//   // const parsedFileResource = await parseResource('/Users/ipselon/Development/projects/webcodesk/github/react-app-framework/src/usr/api/exposed/aboutPanelActions.js');
//   // updateResources(parsedFileResource.resourceType, parsedFileResource.declarationsInFiles);
//   // functionsTree = getUserFunctionsTree();
//   // console.info('Functions: ', JSON.stringify(functionsTree, null, 4));
// });

// it('test updateResources from data', async () => {
//   // const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app';
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/github/react-app-framework';
//   await config.initProjectPaths(projectDirPath);
//   initNewResourcesTrees();
//   const filePath = `${config.etcPagesSourceDir}/page.json`;
//   const fileData = JSON.stringify(page);
//   const declarationsInFiles = await parseResource(filePath, fileData);
//   console.info('Declarations in files: ', JSON.stringify(declarationsInFiles, null, 4));
//   const { updatedResources, deletedResources } = updateResources(declarationsInFiles);
//   console.info('Updated resources: ', JSON.stringify(updatedResources, null, 4));
//   // let functionsTree = getUserFunctionsTree();
//   // console.info('Functions: ', JSON.stringify(functionsTree, null, 4));
//   // let componentsTree = getUserComponentsTree();
//   // console.info('Components: ', JSON.stringify(componentsTree, null, 4));
//   // let componentStoriesTree = getUserComponentStoriesTree();
//   // console.info('Stories: ', JSON.stringify(componentStoriesTree, null, 4));
//   let pagesTree = getPagesTree();
//   console.info('Pages: ', JSON.stringify(pagesTree, null, 4));
//
//   // const parsedFileResource = await parseResource('/Users/ipselon/Development/projects/webcodesk/github/react-app-framework/src/usr/api/exposed/aboutPanelActions.js');
//   // updateResources(parsedFileResource.resourceType, parsedFileResource.declarationsInFiles);
//   // functionsTree = getUserFunctionsTree();
//   // console.info('Functions: ', JSON.stringify(functionsTree, null, 4));
// });
//
// it('test updateResources', async () => {
//   // const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app';
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/test/framework_probe_v_2_0';
//   await config.initProjectPaths(projectDirPath);
//   initNewResourcesTrees();
//   console.info('usrSourceDir: ', config.usrSourceDir);
//   const declarationsInFiles = await parseResource(config.usrSourceDir);
//   // console.info('Declaration in files: ', JSON.stringify(declarationsInFiles, null, 4));
//   updateResources(declarationsInFiles, () => false);
//   // const propTypesTree = getPropTypesTree();
//   // console.info('PropTypes: ', JSON.stringify(propTypesTree, null, 4));
//   const componentsTree = getUserComponentsTree();
//   console.info('Components: ', JSON.stringify(componentsTree, null, 4));
//   // const functionsTree = getUserFunctionsTree();
//   // console.info('Functions: ', JSON.stringify(functionsTree, null, 4));
//   projectResourcesUtils.cleanAllGraphs();
//
// });
