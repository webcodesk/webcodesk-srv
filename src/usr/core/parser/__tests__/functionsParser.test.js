import { findFunctionDeclarations } from '../functionsParser';
import { readFile, writeFile, repairPath } from '../../utils/fileUtils';

const readSourceFile = () => {
  const filePath = '/Users/ipselon/Development/projects/webcodesk/test/framework_probe_v_2_0/src/usr/probe/api/generateObject.ts';
  const validPath = repairPath(filePath);
  return readFile(validPath);
};

// it('get user functions declarations', () => {
//   return readSourceFile().then(fileData => {
//     const declarations = findFunctionDeclarations(fileData);
//     console.info('Declarations: ', JSON.stringify(declarations, null, 2));
//   });
//
// });

it('noop', () => {});