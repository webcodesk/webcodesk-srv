import { getSourceAst } from '../../utils/babelParser';
import { repairPath, readFile, writeFile } from '../../utils/fileUtils';

// it('get AST of the functions JS file', () => {
//   const filePath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app/test/usr/api/myFunctions/exposed.js';
//   const destFilePath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app/test/exposed.js.json';
//   const validPath = repairPath(filePath);
//   return readFile(validPath)
//     .then(fileData => {
//       const ast = getSourceAst(fileData);
//       // return writeFile(destFilePath, JSON.stringify(ast, null, 4));
//       // console.info(JSON.stringify(ast, null, 4));
//     })
//     .catch(error => {
//       console.error(error);
//     })
// });

// it('get AST of the component JS file', () => {
//   const filePath = '/Users/ipselon/Development/projects/webcodesk/bitbucket/webcodesk-app/test/usr/components/javaScript/Hello.js';
//   const destFilePath = '/Users/ipselon/Development/projects/webcodesk/test/test-app-dir-in-the-project/Hello.ast.json';
//   const validPath = repairPath(filePath);
//   return readFile(validPath)
//     .then(fileData => {
//       const ast = getSourceAst(fileData);
//       // return writeFile(destFilePath, JSON.stringify(ast, null, 4));
//       // console.info(JSON.stringify(ast, null, 4));
//     })
//     .catch(error => {
//       console.error(error);
//     })
// });

// it('get AST of the component TS file', () => {
//   // const filePath = '/Users/ipselon/Development/projects/webcodesk/test/probe_typescript_project/src/usr/TitlePanel.tsx';
//   // const destFilePath = '/Users/ipselon/Development/projects/webcodesk/test/probe_typescript_project/src/usr/TitlePanel.tsx.json';
//   // const filePath = '/Users/ipselon/Development/projects/webcodesk/test/probe_typescript_project/src/usr/types/TitlePanel.d.ts';
//   // const destFilePath = '/Users/ipselon/Development/projects/webcodesk/test/probe_typescript_project/src/usr/types/TitlePanel.d.ast.json';
//   const filePath = '/Users/ipselon/Development/projects/webcodesk/test/framework_probe_v_2_0/src/usr/probe/api/generateObject.ts';
//   const destFilePath = '/Users/ipselon/Development/projects/webcodesk/test/framework_probe_v_2_0/src/usr/probe/api/generateObject.ts.ast.json';
//   const validPath = repairPath(filePath);
//   return readFile(validPath)
//     .then(fileData => {
//       const ast = getSourceAst(fileData);
//       return writeFile(destFilePath, JSON.stringify(ast, null, 4));
//       // console.info(JSON.stringify(ast, null, 4));
//     })
//     .catch(error => {
//       console.error(error);
//     })
// });

it('noop', () => {});