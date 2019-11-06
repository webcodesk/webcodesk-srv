import * as restClient from 'usr/core/utils/restClient';
import * as config from 'usr/core/config/config';
import * as publishManager from '../publishManager';
import * as installManager from '../installManager';
import * as javaScriptParser from '../javaScriptParser';
import { readFile, repairPath } from '../../utils/fileUtils';
import {child_process, path, process as nodeProcess} from '../../utils/electronUtils';

jest.setTimeout(120000);

it('noop', () => {});

const readSourceFile = (filePath) => {
  const validPath = repairPath(filePath);
  return readFile(validPath);
};

const selectedItemData =  {
  "components": [
    {
      "id": 33,
      "projectId": 30,
      "name": "api",
      "group": "greeting",
      "description": "## Functions: \n* ### greetings\n* ### initialTitle\n",
      "tags": "greeting tutorial",
      "createDate": 1553280604455,
      "updateDate": 1553541339678,
      "downloadCount": 1,
      "lang": "javascript",
      "type": "functions",
      "license": "MIT",
      "repoUrl": "https://github.com/webcodesk/react-app-framework.git",
      "demoUrl": ""
    },
    {
      "id": 28,
      "projectId": 30,
      "name": "Form",
      "group": "greeting",
      "description": "This is a testing form for the beginner tutorial. Has a single input element and a button.\n\nUse only for testing now.",
      "tags": "testing tutorial",
      "createDate": 1553117084209,
      "updateDate": 1553848757130,
      "downloadCount": 0,
      "lang": "javascript",
      "type": "component",
      "license": "MIT",
      "repoUrl": "https://github.com/webcodesk/react-app-framework.git",
      "demoUrl": ""
    },
    {
      "id": 30,
      "projectId": 30,
      "name": "FormContainer",
      "group": "greeting",
      "description": "\n  Component holds a single form and a title\n ",
      "tags": "form",
      "createDate": 1553268096753,
      "updateDate": 1553268096753,
      "downloadCount": 0,
      "lang": "javascript",
      "type": "component",
      "license": "MIT",
      "repoUrl": "https://github.com/webcodesk/react-app-framework.git",
      "demoUrl": ""
    },
    {
      "id": 32,
      "projectId": 30,
      "name": "Layout",
      "group": "greeting",
      "description": "\n  Holy Grail layout\n ",
      "tags": "holygrail layout grids",
      "createDate": 1553270564995,
      "updateDate": 1553270564995,
      "downloadCount": 0,
      "lang": "javascript",
      "type": "component",
      "license": "MIT",
      "repoUrl": "https://github.com/webcodesk/react-app-framework.git",
      "demoUrl": ""
    },
    {
      "id": 31,
      "projectId": 30,
      "name": "NoMatchTitlePanel",
      "group": "greeting",
      "description": "\n Use panel in `noMatch` page. Link `onBackHome` event to the main or any other page.\n ",
      "tags": "panels",
      "createDate": 1553270069726,
      "updateDate": 1553270069726,
      "downloadCount": 0,
      "lang": "javascript",
      "type": "component",
      "license": "MIT",
      "repoUrl": "https://github.com/webcodesk/react-app-framework.git",
      "demoUrl": ""
    },
    {
      "id": 27,
      "projectId": 30,
      "name": "TitlePanel",
      "group": "greeting",
      "description": "\n  Panel with title\n ",
      "tags": "panel",
      "createDate": 1553113244608,
      "updateDate": 1553116963155,
      "downloadCount": 0,
      "lang": "javascript",
      "type": "component",
      "license": "MIT",
      "repoUrl": "https://github.com/webcodesk/react-app-framework.git",
      "demoUrl": ""
    }
  ],
  "userId": 60,
  "projectId": 30,
  "projectName": "probe_1_js"
};

// it('test install package', async () => {
//   const projectDirPath = repairPath('D:\\Alexander\\projects\\testing\\probe_1_js');
//   const dirName = 'test_installation';
//   await config.initProjectPaths(projectDirPath);
//
//   try {
//     await installManager.installPackage(selectedItemData, dirName);
//   } catch (e) {
//     console.error(e);
//   } finally {
//     await installManager.removeDownloadDir();
//   }
//
//   console.info('***');
//   console.info('***');
//   console.info('***');
// });

