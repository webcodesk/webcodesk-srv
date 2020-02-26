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

