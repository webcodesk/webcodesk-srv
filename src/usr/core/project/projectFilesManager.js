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
