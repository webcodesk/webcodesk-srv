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
