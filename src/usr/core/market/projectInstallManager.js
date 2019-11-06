import path from 'path-browserify';
import forOwn from 'lodash/forOwn';
import merge from 'lodash/merge';
import { repairPath, copyFile, removeFile, writeFile, readJson } from '../utils/fileUtils';
import * as restClient from '../utils/restClient';
import * as constants from '../../../commons/constants';
import { invokeServer } from '../utils/serverUtils';

export function writeNewPackageFile(packageFileData, dirPath) {
  const packageFilePath = repairPath(path.join(dirPath, constants.FILE_NAME_PACKAGE));
  return readJson(packageFilePath)
    .then(existingPackageConfig => {
      const newPackageConfig = merge(packageFileData, existingPackageConfig);
      return writeFile(packageFilePath, JSON.stringify(newPackageConfig, null, 2));
    })
    .catch(error => {
      // there is no package.json in the project dir
      return writeFile(packageFilePath, JSON.stringify(packageFileData, null, 2));
    })
}

export function downloadPackage(downloadURL, dirPath) {
  const destDirPath = repairPath(path.join(dirPath, constants.DIR_NAME_DOWNLOAD));
  return removeFile(destDirPath)
    .then(() => {
      return restClient.download2(downloadURL, destDirPath)
    })
    .then(() => {
      return unpackPackagesInDownloadDir(destDirPath);
    });
}

export function installProject(packageFileList, dirPath) {
  let sequence = Promise.resolve();
  if (packageFileList && packageFileList.length > 0) {
    packageFileList.forEach(fileItem => {
      sequence = sequence.then(() => {
        const { absoluteFilePath, relativeFilePath } = fileItem;
        const destFilePath = repairPath(path.join(dirPath, relativeFilePath));
        return copyFile(absoluteFilePath, destFilePath);
      });
    });
  }
  return sequence.then(() => {
    return install(dirPath);
  });
}

export function installAsPackage(
  packageFileList, packageDependencies, packageDevDependencies, dirPath, newPackageDirPath
) {
  // const packageDownloadDirPath = repairPath(path.join(dirPath, constants.DIR_NAME_DOWNLOAD));
  let sequence = Promise.resolve();
  if (packageFileList && packageFileList.length > 0) {
    const usrSourceDirPrefix =
      `/${constants.DIR_NAME_SRC}/${constants.DIR_NAME_USR}`;
    const usrTemplatesDirPrefix =
      `/${constants.DIR_NAME_SRC}/${constants.DIR_NAME_ETC}/${constants.DIR_NAME_TEMPLATES}`;
    packageFileList.forEach(fileItem => {
      sequence = sequence.then(() => {
        const { absoluteFilePath, relativeFilePath } = fileItem;
        if (relativeFilePath.indexOf(usrSourceDirPrefix) === 0) {
          const newFileDirPath = repairPath(path.join(dirPath, usrSourceDirPrefix, newPackageDirPath));
          const destFilePath = relativeFilePath.replace(usrSourceDirPrefix, newFileDirPath);
          return copyFile(absoluteFilePath, destFilePath);
        } else if (relativeFilePath.indexOf(usrTemplatesDirPrefix) === 0) {
          const newFileDirPath = repairPath(path.join(dirPath, usrTemplatesDirPrefix, newPackageDirPath));
          const destFilePath = relativeFilePath.replace(usrTemplatesDirPrefix, newFileDirPath);
          return copyFile(absoluteFilePath, destFilePath);
        }
      });
    });
  }
  if (packageDependencies) {
    sequence = sequence.then(() => {
      const depsList = [];
      forOwn(packageDependencies, (value, key) => {
        depsList.push(`${key}@${value}`);
      });
      const depsString = depsList.length > 0 ? depsList.join(' ') : '';
      return install(dirPath, depsString, false);
    });
  }
  if (packageDevDependencies) {
    sequence = sequence.then(() => {
      const depsList = [];
      forOwn(packageDevDependencies, (value, key) => {
        depsList.push(`${key}@${value}`);
      });
      const depsString = depsList.length > 0 ? depsList.join(' ') : '';
      return install(dirPath, depsString, true);
    });
  }
  return sequence;
}

export function removeDownloadDir(dirPath) {
  const destDirPath = repairPath(path.join(dirPath, constants.DIR_NAME_DOWNLOAD));
  return removeFile(destDirPath);
}

function unpackPackagesInDownloadDir(dirPath) {
  return invokeServer('unpackPackagesInDir', dirPath);
}

function install(destDirPath, dependencies, isDevelopment) {
  return invokeServer('install', {destDirPath, dependencies, isDevelopment});
}
