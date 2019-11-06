import * as config from '../../config/config';
import { initNewResourcesTrees, updateResources } from '../projectResourcesManager';
import { parseResource } from '../../parser/parserManager';
import * as projectResourcesCompiler from '../projectResourcesCompiler';

it('noop', () => {});

// it('test compileResources', async () => {
//   // const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app';
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/test/hello_app';
//   await config.initProjectPaths(projectDirPath);
//   initNewResourcesTrees();
//   let declarationsInFiles = await parseResource(config.usrSourceDir);
//   declarationsInFiles = declarationsInFiles.concat(await parseResource(config.etcSourceDir));
//   // declarationsInFiles.forEach(declarationsInFile => {
//   //   console.info(JSON.stringify(declarationsInFile.declarations, null, 2));
//   // });
//   updateResources(declarationsInFiles, () => false);
//
//   // projectResourcesCompiler.compileResources();
//
// });