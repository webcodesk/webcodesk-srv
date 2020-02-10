/*
 *    Copyright 2019 Alex (Oleksandr) Pustovalov
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { SequentialTaskQueue } from 'sequential-task-queue';
import * as projectManager from '../core/project/projectManager';
import appWindowMessages from '../../commons/appWindowMessages';

// Use sequential queue for accessing graph instance while multiple resources added in parallel
const taskQueue = new SequentialTaskQueue();

export const processMainWindowMessage = ({ messageType, messageData }) => async (dispatch) => {
  if (messageType === appWindowMessages.WATCHER_FILE_WAS_ADDED) {
    const { path } = messageData;
    dispatch({resourceAdded: path});
  } else if (messageType === appWindowMessages.WATCHER_FILE_WAS_CHANGED) {
    const { path } = messageData;
    dispatch({resourceChanged: path});
  } else if (messageType === appWindowMessages.WATCHER_FILE_WAS_REMOVED) {
    const { path } = messageData;
    dispatch({resourceRemoved: path});
  } else if (messageType === appWindowMessages.OPEN_PROJECT_README) {
    dispatch({openProjectReadme: true});
  } else if (messageType === appWindowMessages.SHOW_SYSLOG_DIALOG) {
    dispatch({showSyslog: true});
  } else if (messageType === appWindowMessages.PROJECT_SERVER_STATUS_RESPONSE) {
    dispatch({projectServerStatus: messageData});
  } else if (messageType === appWindowMessages.PROJECT_SERVER_LOG_RESPONSE) {
    dispatch({projectServerLog: messageData});
  }
};

export const readResource = (resourcePath) => (dispatch) => {
  taskQueue.push(async () => {
    try {
      const update = await projectManager.readResource(resourcePath);
      if (update.updatedResources && update.updatedResources.length > 0) {
        dispatch({success: true});
      }
      if (update.doUpdateAll) {
        dispatch({changedByCompilation: true});
      }
    } catch (e) {
      // do nothing
    }
  });
};

export const removeResource = (resourcePath) => async (dispatch) => {
  taskQueue.push(async () => {
    const update = await projectManager.removeResource(resourcePath);
    dispatch({success: true});
    if (update.doUpdateAll) {
      dispatch({changedByCompilation: true});
    }
  });
};

export const updateResource = (fileObject) => async (dispatch) => {
  taskQueue.push(async () => {
    try {
      const update = await projectManager.updateResource(fileObject.filePath, fileObject.fileData);
      if (update.updatedResources && update.updatedResources.length > 0) {
        dispatch({success: true});
      }
      if (update.doUpdateAll) {
        dispatch({changedByCompilation: true});
      }
    } catch (e) {
      console.error(e.message);
    }
  });
};

export const updateMultipleResources = (fileObjects) => async (dispatch) => {
  taskQueue.push(async () => {
    try {
      const update = await projectManager.updateMultipleResources(fileObjects);
      if (update.updatedResources && update.updatedResources.length > 0) {
        dispatch({success: true});
      }
      if (update.doUpdateAll) {
        dispatch({changedByCompilation: true});
      }
    } catch (e) {
      console.error(e.message);
    }
  });
};

export const writeEtcFile = ({filePath, fileData}) => async (dispatch) => {
  taskQueue.push(async () => {
    try {
      await projectManager.writeEtcFile(filePath, fileData);
      dispatch({success: {filePath, fileData}});
    } catch (e) {
      console.error(`Writing etc file ${filePath}.`, e.message);
      dispatch({exception: e});
    }
  });
};

export const writeMultipleEtcFiles = (fileObjects) => async (dispatch) => {
  if (fileObjects && fileObjects.length > 0) {
    for (let i = 0; i < fileObjects.length; i++) {
      const {filePath, fileData} = fileObjects[i];
      taskQueue.push(async () => {
        try {
          await projectManager.writeEtcFile(filePath, fileData);
          dispatch({success: {filePath, fileData}});
        } catch (e) {
          console.error(`Writing etc file ${filePath}.`, e.message);
          dispatch({exception: e});
        }
      });
    }
  }
};

export const deleteEtcFile = (filePath) => async (dispatch) => {
  taskQueue.push(async () => {
    try {
      await projectManager.deleteEtcFile(filePath);
      dispatch({success: filePath});
    } catch (e) {
      console.error(`Deleting etc file ${filePath}.`, e.message);
      dispatch({exception: e});
    }
  });
};

export const getSyslog = () => async (dispatch) => {
  const sysLog = await projectManager.getSyslog();
  dispatch({sysLog: sysLog});
  dispatch({isOpen: true});
};
