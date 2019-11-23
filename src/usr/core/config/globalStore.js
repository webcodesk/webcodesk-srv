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

import {
  getRecord,
  setRecord,
} from './storage';
import * as config from './config';

const store = new Map();

const globalStore = {
  restore: async function(key) {
    const result = await getRecord(config.projectDirPath, key);
    store.set(key, result);
    return result;
  },
  get: function (key) {
    return store.get(key);
  },
  set: function (key, object, doMakeRecord = false) {
    if (doMakeRecord) {
      setRecord(config.projectDirPath, object, key);
    }
    store.set(key, object);
  },
  merge: function (key, object, doMakeRecord = false) {
    const existingObject = this.get(key);
    const newObject = {...existingObject, ...object};
    if (doMakeRecord) {
      setRecord(config.projectDirPath, newObject, key);
    }
    store.set(key, newObject);
    return newObject;
  },
  clear: function () {
    store.clear();
  }
};

export default globalStore;
