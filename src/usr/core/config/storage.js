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

import isUndefined from 'lodash/isUndefined';
import localforage from 'localforage';
import { SequentialTaskQueue } from 'sequential-task-queue';
import { repairPath } from "../utils/fileUtils";

// Use sequential queue for accessing graph instance while multiple resources added in parallel
const taskQueue = new SequentialTaskQueue();

let storageInstance;

function getCurrentTimeString() {
  const time = new Date();
  let minutes = time.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  let hours = time.getHours();
  hours = hours < 10 ? `0${hours}` : hours;
  let seconds = time.getSeconds();
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  let milliseconds = time.getMilliseconds();
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export function initStorage() {
  localforage.config({
    name: 'Webcodedesk'
  });
}

export function getStorageInstance() {
  if (!storageInstance) {
    initStorage();
    storageInstance = localforage.createInstance({
      name: 'commonWebcodeskStorage',
    });
  }
  return storageInstance;
}

export async function getProjectSettings(dirPath) {
  const validDirPath = repairPath(dirPath);
  return getStorageInstance().getItem(validDirPath);
}

export async function saveProjectSettings(dirPath, projectSettingsObj) {
  const validDirPath = repairPath(dirPath);
  return getStorageInstance().setItem(validDirPath, projectSettingsObj);
}

export async function clearConsoleErrors() {
  return getStorageInstance().setItem('SYSLOG', []).catch(e => {});
}

export async function consoleError() {
  const args = arguments;
  taskQueue.push(() => {
    return getStorageInstance().getItem('SYSLOG')
      .then(sysLog => {
        sysLog = sysLog || [];
        if (!isUndefined(args[0])) {
          if (!isUndefined(args[1])) {
            sysLog.push(`${getCurrentTimeString()} ${args[0]} ${args[1]}`);
          } else {
            sysLog.push(`${getCurrentTimeString()} ${args[0]}`);
          }
        }
        return getStorageInstance().setItem('SYSLOG', sysLog);
      }).catch(e => {
        // do nothing
      })
  });
}

export async function getConsoleErrors() {
  return getStorageInstance().getItem('SYSLOG');
}

export async function setRecord(recordObjectKey, recordObject, storageKey) {
  return getStorageInstance().getItem(storageKey)
    .then(record => {
      record = record || {};
      record[recordObjectKey] = recordObject;
      return getStorageInstance().setItem(storageKey, record);
    });
}

export async function getRecord(recordObjectKey, storageKey) {
  return getStorageInstance().getItem(storageKey)
    .then(record => {
      record = record || {};
      return record[recordObjectKey]
    });
}

// export async function setRecordOfComponentPropsKeys(projectKey, expandedResourcesKeys) {
//   return getStorageInstance().getItem(STORAGE_RECORD_EXPANDED_COMPONENT_PROPS_KEYS)
//     .then(recordOfExpandedKeys => {
//       recordOfExpandedKeys = recordOfExpandedKeys || {};
//       recordOfExpandedKeys[projectKey] = expandedResourcesKeys;
//       return getStorageInstance().setItem(STORAGE_RECORD_EXPANDED_COMPONENT_PROPS_KEYS, recordOfExpandedKeys);
//     });
// }
//
// export async function getRecordOfComponentPropsKeys(projectKey) {
//   return getStorageInstance().getItem(STORAGE_RECORD_EXPANDED_COMPONENT_PROPS_KEYS)
//     .then(recordOfExpandedKeys => {
//       recordOfExpandedKeys = recordOfExpandedKeys || {};
//       return recordOfExpandedKeys[projectKey]
//     });
// }

