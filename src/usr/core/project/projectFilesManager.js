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

const declarationsInFilesCache = new Map();

export function resetDeclarationsInFiles() {
  declarationsInFilesCache.clear();
}

export function updateDeclarationsInFiles(declarationsInFiles) {
  const newDeclarationsInFiles = [];
  if (declarationsInFiles && declarationsInFiles.length > 0) {
    declarationsInFiles.forEach(declarationsInFile => {
      const declarationsKey = `${declarationsInFile.resourceType}${declarationsInFile.filePath}`;
      const cachedDeclarationsInFile = declarationsInFilesCache.get(declarationsKey);
      if (!cachedDeclarationsInFile || !cachedDeclarationsInFile.isEqual(declarationsInFile)) {
        declarationsInFilesCache.set(declarationsKey, declarationsInFile);
        newDeclarationsInFiles.push(declarationsInFile);
      }
    });
  }
  return newDeclarationsInFiles;
}

export function getAllDeclarationsInFile(filePath) {
  const result = [];
  declarationsInFilesCache.forEach((value, key) => {
    if(key.indexOf(filePath) > 0) {
      result.push(value);
    }
  });
  return result;
}

export function removeDeclarationsInFile(filePath) {
  declarationsInFilesCache.forEach((value, key) => {
    if(key.indexOf(filePath) > 0) {
      declarationsInFilesCache.delete(key);
    }
  });
}

export function removeDeclarationsInDir(dirPath) {
  declarationsInFilesCache.forEach((value, key) => {
    if(key.indexOf(dirPath) === 0) {
      declarationsInFilesCache.delete(key);
    }
  });
}
