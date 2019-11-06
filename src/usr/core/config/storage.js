import isUndefined from 'lodash/isUndefined';
import take from 'lodash/take';
import localforage from 'localforage';
import { SequentialTaskQueue } from 'sequential-task-queue';
import { repairPath } from "../utils/fileUtils";

// Use sequential queue for accessing graph instance while multiple resources added in parallel
const taskQueue = new SequentialTaskQueue();

let storageInstance;

const STORAGE_RECORD_RECENT_PROJECTS = 'recentProjects';
const STORAGE_RECORD_EXPANDED_RESOURCE_KEYS = 'expandedResourceKeys';

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

export async function addProjectToRecentProjects(dirPath) {
  return getStorageInstance().getItem(STORAGE_RECORD_RECENT_PROJECTS)
      .then(recentProjectPaths => {
        recentProjectPaths = recentProjectPaths || [];
        const validDirPath = repairPath(dirPath);
        const foundIndex = recentProjectPaths.findIndex(i => i === validDirPath);
        if (foundIndex >= 0) {
          recentProjectPaths.splice(foundIndex, 1);
        }
        recentProjectPaths.unshift(validDirPath);
        if (recentProjectPaths.length > 5) {
          recentProjectPaths = take(recentProjectPaths, 5);
        }
        return getStorageInstance().setItem(STORAGE_RECORD_RECENT_PROJECTS, recentProjectPaths);
      });
}

export async function getRecentProjects() {
  return getStorageInstance().getItem(STORAGE_RECORD_RECENT_PROJECTS);
}

export async function removeRecentProject(dirPath) {
  return getStorageInstance().getItem(STORAGE_RECORD_RECENT_PROJECTS)
    .then(recentProjectPaths => {
      recentProjectPaths = recentProjectPaths || [];
      const validDirPath = repairPath(dirPath);
      const foundIndex = recentProjectPaths.findIndex(i => i === validDirPath);
      if (foundIndex >= 0) {
        recentProjectPaths.splice(foundIndex, 1);
      }
      return getStorageInstance().setItem(STORAGE_RECORD_RECENT_PROJECTS, recentProjectPaths);
    });
}

export async function getProjectSettings(dirPath) {
  const validDirPath = repairPath(dirPath);
  return getStorageInstance().getItem(validDirPath);
}

export async function saveProjectSettings(dirPath, projectSettingsObj) {
  const validDirPath = repairPath(dirPath);
  return getStorageInstance().setItem(validDirPath, projectSettingsObj);
}

export async function getWelcomeInfo() {
  return getStorageInstance().getItem('welcome');
}

export async function saveWelcomeInfo(info) {
  return getStorageInstance().getItem('welcome')
    .then(prevInfo => {
      return getStorageInstance().setItem('welcome', {...prevInfo, ...info});
    })
    .catch(error => {
      console.error('Can not read/write welcome info');
    });
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

export async function setRecordOfExpandedKeys(dirPath, expandedResourcesKeys) {
  return getStorageInstance().getItem(STORAGE_RECORD_EXPANDED_RESOURCE_KEYS)
    .then(recordOfExpandedKeys => {
      recordOfExpandedKeys = recordOfExpandedKeys || {};
      recordOfExpandedKeys[dirPath] = expandedResourcesKeys;
      return getStorageInstance().setItem(STORAGE_RECORD_EXPANDED_RESOURCE_KEYS, recordOfExpandedKeys);
    });
}

export async function getRecordOfExpandedKeys(dirPath) {
  return getStorageInstance().getItem(STORAGE_RECORD_EXPANDED_RESOURCE_KEYS)
    .then(recordOfExpandedKeys => {
      recordOfExpandedKeys = recordOfExpandedKeys || {};
      return recordOfExpandedKeys[dirPath]
    });
}

