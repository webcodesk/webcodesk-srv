/*
 *     Webcodesk
 *     Copyright (C) 2019  Oleksandr (Alex) Pustovalov
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
