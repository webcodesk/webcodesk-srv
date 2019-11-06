import { readFile, repairPath } from '../../utils/fileUtils';
import { findComponentDeclarations } from '../componentsParser';
import * as config from '../../config/config';

const readSourceFile = (filePath) => {
  const validPath = repairPath(filePath);
  return readFile(validPath);
};


// it('test getClassDeclarations with the proptypes declaration out of class body', async () => {
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/test/framework_probe_v_2_0';
//   await config.initProjectPaths(projectDirPath);
//   // const filePath = repairPath('D:\\Alexander\\projects\\webcodesk\\bitbucket\\webcodesk_site_app\\src\\usr\\components\\common\\NewAccountFormTitle.js');
//   const filePath = repairPath('/Users/ipselon/Development/projects/webcodesk/test/framework_probe_v_2_0/src/usr/probe/components/ProbeView.tsx');
//   // const filePath = repairPath('D:\\Alexander\\projects\\testing\\probe_12_ts\\src\\usr\\greetingComponents\\Form.tsx');
//   // const filePath = repairPath('D:\\Alexander\\projects\\testing\\probe_12_ts\\src\\usr\\greetingComponents\\MyTestComponent.tsx');
//   return readSourceFile(filePath).then(fileData => {
//     // console.info(fileData);
//     const declarations = findComponentDeclarations(fileData, config.projectRootSourceDir, filePath);
//     console.info('Class declarations: ', JSON.stringify(declarations, null, 4));
//     console.info('--------------------');
//     console.info('--------------------');
//     console.info('--------------------');
//   });
// });

// it('test getClassDeclarations with the proptypes declaration inside of class body', () => {
//   const filePath = '/Users/ipselon/Development/projects/webcodesk/github/react-app-framework/src/usr/layouts/CSSGrid_HolyGrail_2.js';
//   return readSourceFile(filePath).then(fileData => {
//     // console.info(fileData);
//     const declarations = findComponentDeclarations(fileData);
//     console.info('Class declarations: ', JSON.stringify(declarations, null, 4));
//   });
// });

it('noop', () => {});