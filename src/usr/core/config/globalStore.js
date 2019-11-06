import { getRecordOfExpandedKeys, setRecordOfExpandedKeys } from './storage';
import * as config from './config';

const store = new Map();

const globalStore = {
  restore: async function(key) {
    let result = null;
    if (key === 'expandedResourceKeys') {
      result = await getRecordOfExpandedKeys(config.projectDirPath);
      store.set(key, result);
    }
    return result;
  },
  get: function (key) {
    return store.get(key);
  },
  set: function (key, object) {
    if (key === 'expandedResourceKeys') {
      setRecordOfExpandedKeys(config.projectDirPath, object);
    }
    store.set(key, object);
  },
  clear: function () {
    store.clear();
  }
};

export default globalStore;
