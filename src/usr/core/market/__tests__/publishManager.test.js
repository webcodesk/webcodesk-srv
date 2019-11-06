import * as restClient from 'usr/core/utils/restClient';
import * as config from 'usr/core/config/config';
import * as publishManager from '../publishManager';
import * as installManager from '../installManager';
import * as javaScriptParser from '../javaScriptParser';
import { readFile, repairPath } from '../../utils/fileUtils';

jest.setTimeout(120000);

it('noop', () => {});

const readSourceFile = (filePath) => {
  const validPath = repairPath(filePath);
  return readFile(validPath);
};

// it('test prepareComponent', async () => {
//   const projectDirPath = 'D:\\Alexander\\projects\\testing\\probe_1_js';
//   const uploadDirPath = 'D:\\Alexander\\projects\\testing\\probe_1_js\\__upload__';
//   const componentPath = 'D:\\Alexander\\projects\\testing\\probe_1_js\\src\\usr\\sdsd.js';
//   await config.initProjectPaths(projectDirPath);
//
//   try {
//     const result = await publishManager.prepareComponentPackage(componentPath, uploadDirPath);
//     console.info('Result files: ', JSON.stringify(result.files, null, 4));
//     const tokenWrapper = await restClient.post('/auth', null, {username: 'apustovalov@gmail.com', password: 'qwerty'});
//     if (tokenWrapper) {
//       const {token} = tokenWrapper;
//       const options = {
//         projectName: config.projectName,
//         groupName: 'greeting',
//         componentName: result.componentName,
//         repoUrl: 'https://test_repo',
//         demoUrl: 'https://demo_another_address',
//         description: 'Test Component',
//         tags: 'Test, MUI, layouts',
//       };
//       console.info('Options: ', JSON.stringify(options, null, 4));
//       // await publishManager.uploadPackage(result.files, options, token);
//     }
//   } catch (e) {
//     console.error(e);
//   }
//   // const fileData = await readSourceFile(componentPath);
//   // javaScriptParser.parse(fileData);
//
//   console.info('***');
//   console.info('***');
//   console.info('***');
// });

// it('test publishComponent', async () => {
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/test/hello_app';
//   const uploadDirPath = '/Users/ipselon/Development/projects/webcodesk/test/hello_app/__upload__';
//   const componentPath = '/Users/ipselon/Development/projects/webcodesk/test/hello_app/src/usr/layouts/HolyGrail.js';
//   await config.initProjectPaths(projectDirPath);
//
//   try {
//     const result = await publishManager.prepareComponentPackage(componentPath, uploadDirPath);
//     await publishManager.checkExtraDeps(result.dependenciesFilePath, ['@webcodesk/react-scripts']);
//     await publishManager.makePackageFile(result.packageDirPath, result.packageFilePath);
//     console.info('Result: ', JSON.stringify(result, null, 4));
//     // const tokenWrapper = await restClient.post('/auth', null, {username: 'apustovalov@gmail.com', password: 'qwerty'});
//     // if (tokenWrapper) {
//     //   const {token} = tokenWrapper;
//     //   const options = {
//     //     projectName: config.projectName,
//     //     groupName: 'greeting',
//     //     componentName: result.componentName,
//     //     repoUrl: 'https://test_repo',
//     //     demoUrl: 'https://demo_another_address',
//     //     description: 'Test Component',
//     //     tags: 'Test, MUI, layouts',
//     //   };
//     //   console.info('Options: ', JSON.stringify(options, null, 4));
//     //   const files = {
//     //       file: result.packageFilePath,
//     //       readme: result.readmeCopyFilePath,
//     //   };
//     //   // await publishManager.uploadPackage(result.files, options, token);
//     // }
//   } catch (e) {
//     console.error(e);
//   }
//   // const fileData = await readSourceFile(componentPath);
//   // javaScriptParser.parse(fileData);
//
//   console.info('***');
//   console.info('***');
//   console.info('***');
// });

// it('test installComponent', async () => {
//   // const projectDirPath = 'D:\\Alexander\\projects\\testing\\test_download_ts';
//   const projectDirPath = 'D:\\Alexander\\projects\\testing\\test_install_component';
//   const packageFilePath = 'D:\\Alexander\\projects\\testing\\test_download_ts\\__install__\\FormContainer.tar.gz';
//   const componentDirPath = 'D:\\Alexander\\projects\\testing\\test_install_component\\src\\usr\\installed';
//   // await config.initProjectPaths(projectDirPath);
//
//   try {
//     await installManager.installComponent(packageFilePath, componentDirPath, projectDirPath);
//   } catch (e) {
//     console.error(e);
//   }
//
//   console.info('***');
//   console.info('***');
//   console.info('***');
// });

// it('test upload component', async () => {
//   const projectDirPath = 'D:\\Alexander\\projects\\testing\\test_download_ts';
//   await config.initProjectPaths(projectDirPath);
//   const tokenWrapper = await restClient.post('/auth', null, {username: 'apustovalov@gmail.com', password: 'qwerty'});
//   if (tokenWrapper) {
//     const {token} = tokenWrapper;
//     await publishManager.uploadPackage('TestComponent', token);
//   }
//   console.info('***');
//   console.info('***');
//   console.info('***');
//
// });