import * as config from 'usr/core/config/config';
import * as constants from 'usr/commons/constants';
import * as scaffoldManager from '../scaffoldManager';

it('noop', () => {});

// it('test generateComponentScaffold', async () => {
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/test/hello_app';
//   await config.initProjectPaths(projectDirPath);
//   await scaffoldManager.generateComponentScaffold(
//     'TestComponent',
//     'myComponents/TestComponent',
//     constants.TSX_FILE_EXTENSION,
//     'empty'
//   );
//   await scaffoldManager.generateComponentScaffold(
//     'TestComponent',
//     'myComponents/TestComponent',
//     constants.TSX_FILE_EXTENSION,
//     'view'
//   );
//   await scaffoldManager.generateComponentScaffold(
//     'TestComponent',
//     'myComponents/TestComponent',
//     constants.TSX_FILE_EXTENSION,
//     'form'
//   );
//   await scaffoldManager.generateComponentScaffold(
//     'TestComponent',
//     'myComponents/TestComponent',
//     constants.TSX_FILE_EXTENSION,
//     'centered'
//   );
// });

// it('test generateFunctionsScaffold', async () => {
//   const projectDirPath = '/Users/ipselon/Development/projects/webcodesk/test/hello_app';
//   await config.initProjectPaths(projectDirPath);
//   await scaffoldManager.generateFunctionsScaffold(
//     'myFunctions',
//     'generated',
//     constants.JS_FILE_EXTENSION,
//     {'setValue': true, 'getValue': true, 'setAndGetValue': true},
//     'string'
//   );
//   await scaffoldManager.generateFunctionsScaffold(
//     'myFunctions',
//     'generated',
//     constants.TS_FILE_EXTENSION,
//     {'setValue': true, 'getValue': true, 'setAndGetValue': true},
//     'string'
//   );
// });
