import { parseSourceCodeFiles, parseSourceFileAsync, parseResource } from '../parserManager';
import { fs } from '../../utils/electronUtils';
import { readDir } from '../../utils/dirUtils';
import * as config from '../../config/config';

// it('parse all source code files in directory', () => {
//   const dirPath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app/test/usr';
//   console.info(dirPath);
//   try {
//     return parseSourceCodeFiles(dirPath).then(declarationsInFiles => {
//       console.info(JSON.stringify(declarationsInFiles, null, 2));
//     });
//   } catch (e) {
//     console.error(e);
//   }
// });

// it('read file stat', async () => {
//   const start = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app/src/usr';
//   // expect('Test').toBe('Test 1');
//   const task = new Promise((resolve, reject) => {
//     fs().lstat(start, (err, stat) => {
//       console.info('LSTAT: ', err, stat);
//       if (err) {
//         reject(err);
//       }
//       resolve(stat);
//     });
//   });
//   try {
//     await task;
//
//   } catch (err) {
//     console.error(err);
//   }
// });

// it('dir utils read dir recursively',async () => {
//   const start = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app/src/usr';
//   const files = await readDir(start, ['*.test.js']);
//   console.info('files: ', files);
// });
//

// it('test parseResource', async () => {
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/github/react-app-framework';
//   await config.initProjectPaths(projectDirPath);
//   const declarationsInFiles = await parseResource(config.usrSourceDir);
//   declarationsInFiles.forEach(declarationsInFile => {
//     console.info('Declaration in files: ', declarationsInFile.resourceType);
//     console.info('Declaration in files: ', JSON.stringify(declarationsInFile.declarations, null, 4));
//   });
//
// });

// it('test parserResource from file page.json', async () => {
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/github/react-app-framework';
//   await config.initProjectPaths(projectDirPath);
//   const filePath = '/Users/ipselon/Development/projects/webcodesk/github/react-app-framework/src/etc/pages/page.json';
//   const fileData = JSON.stringify(page);
//   const declarationsInFiles = await parseResource(filePath, fileData);
//   // const declarationsInFiles = await parseResource(filePath);
//   console.info(JSON.stringify(declarationsInFiles, null, 4));
// });

it('noop', () => {});