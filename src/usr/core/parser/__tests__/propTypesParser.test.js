import { readFile, repairPath } from '../../utils/fileUtils';
import { findPropTypesDeclarations } from '../propTypesParser';
import * as config from '../../config/config';

const readSourceFile = (filePath) => {
  const validPath = repairPath(filePath);
  return readFile(validPath);
};


// it('test getPropTypesDeclarations in file', async () => {
//   // const filePath = repairPath('D:\\Alexander\\projects\\webcodesk\\bitbucket\\webcodesk_site_app\\src\\usr\\components\\common\\NewAccountFormTitle.js');
//   // const filePath = repairPath('D:\\Alexander\\projects\\testing\\probe_alpha_12_ts\\src\\usr\\greeting\\FormContainer.tsx');
//   // const filePath = repairPath('D:\\Alexander\\projects\\testing\\probe_12_ts\\src\\usr\\greetingComponents\\Form.tsx');
//   // const filePath = repairPath('D:\\Alexander\\projects\\testing\\probe_12_ts\\src\\usr\\greetingComponents\\MyTestComponent.tsx');
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/test/framework_probe_v_2_0';
//   const filePath = '/Users/ipselon/Development/projects/webcodesk/test/framework_probe_v_2_0/src/usr/probe/props/ProbeLayer.props.ts';
//   await config.initProjectPaths(projectDirPath);
//   return readSourceFile(filePath).then(fileData => {
//     // console.info(fileData);
//     const declarations = findPropTypesDeclarations(fileData, config.projectRootSourceDir, filePath);
//     console.info('Class declarations: ', JSON.stringify(declarations, null, 4));
//     console.info('--------------------');
//     console.info('--------------------');
//     console.info('--------------------');
//   });
// });

it('noop', () => {});