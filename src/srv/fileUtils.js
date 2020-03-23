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

import request from 'request';
import fs from 'fs-extra';
import path from 'path';
import tar from 'tar-fs';
import zlib from 'zlib';
import { includes } from 'lodash';
import { FILE_SEPARATOR } from '../commons/constants';

export function ensureFilePath (filePath) {
  return new Promise((resolve, reject) => {
    fs.ensureFile(filePath, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function ensureDirPath (dirPath) {
  return new Promise((resolve, reject) => {
    fs.ensureDir(dirPath, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function readFile (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        reject('Can\'t read file: ' + filePath + '. Cause: ' + err.message);
      } else {
        resolve(data);
      }
    });
  });
}

export function readFileSync (filePath) {
  return fs.readFileSync(filePath, { encoding: 'utf8' });
}

export function writeFile (filePath, fileData) {
  return new Promise((resolve, reject) => {
    if (!fileData) {
      reject('File data is undefined. File path: ' + filePath);
    }
    fs.writeFile(filePath, fileData, { encoding: 'utf8' }, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function writeBinaryFile (filePath, fileData) {
  return new Promise((resolve, reject) => {
    if (!fileData) {
      reject('File data is undefined. File path: ' + filePath);
    }
    fs.writeFile(filePath, fileData, { encoding: null }, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function readBlobAsArrayBuffer (blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      if (fileReader.result) {
        resolve(fileReader.result);
      } else {
        reject('Error reading blob file.');
      }
    };
    fileReader.readAsArrayBuffer(blob);
  });
}

export function copyFiles (options) {
  return options.reduce(
    (sequence, valuePair) => {
      return sequence.then(() => {
        return copyFile(valuePair.srcFilePath, valuePair.destFilePath);
      });
    },
    Promise.resolve()
  );
}

export function copyFilesNoError (options) {
  return options.reduce(
    (sequence, valuePair) => {
      return sequence.then(() => {
        return copyFile(valuePair.srcFilePath, valuePair.destFilePath)
          .catch(error => {
            console.error(error);
          });
      });
    },
    Promise.resolve()
  );
}

export function copyFile (srcFilePath, destFilePath) {
  return new Promise((resolve, reject) => {
    fs.stat(srcFilePath, (err, stat) => {
      if (err) {
        reject(err);
      } else if (stat) {
        if (stat.isDirectory()) {
          fs.ensureDir(destFilePath, err => {
            if (err) {
              reject(err);
            } else {
              fs.copy(srcFilePath, destFilePath, function (err) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            }
          });
        } else if (stat.isFile()) {
          fs.ensureFile(destFilePath, err => {
            if (err) {
              reject(err);
            } else {
              fs.copy(srcFilePath, destFilePath, function (err) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            }
          });
        }
      }
    });
  });
}

export function traverseDirTree (tree, callback) {
  if (tree) {
    if (tree.dirs && tree.dirs.length > 0) {
      tree.dirs.forEach(dir => {
        callback('dir', dir);
        traverseDirTree(dir, callback);
      });
    }
    if (tree.files && tree.files.length > 0) {
      tree.files.forEach(file => {
        callback('file', file);
      });
    }
  }
}

export function isExisting (filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stat) => {
      if (err) {
        reject(err);
      } else {
        if (stat.isDirectory() || stat.isFile()) {
          resolve();
        } else {
          reject(filePath + ' is not a file or a dir');
        }
      }
    });
  });
}

export function readDirectoryTree (result, start, callback, testFileNames = undefined) {
  // Use lstat to resolve symlink if we are passed a symlink
  fs.lstat(start, (err, stat) => {
      if (err) {
        callback(err);
      }
      let total = 0;
      let processed = 0;
      let isDir = (dirPath, fileName) => {
        const abspath = path.join(dirPath, fileName).replace(/\\/g, '/');
        fs.stat(abspath, (err, stat) => {
          if (err) {
            callback(err);
          }
          if (stat && stat.isDirectory()) {
            let dirNamePath = result.dirNamePath ? result.dirNamePath + '.' + fileName : fileName;
            let resultDir = { dirName: fileName, dirNamePath: dirNamePath, dirPath: abspath, dirs: [], files: [] };
            result.dirs.push(resultDir);
            readDirectoryTree(resultDir, abspath, err => {
              if (err) {
                callback(err);
              }
              if (++processed === total) {
                callback();
              }
            }, testFileNames);
          } else {
            let isValid = testFileNames ? includes(testFileNames, fileName) : true;
            if (isValid) {
              result.files.push({
                fileName: fileName,
                filePath: abspath
              });
            }
            if (++processed === total) {
              callback();
            }
          }
        });
      };
      if (stat && stat.isDirectory()) {
        fs().readdir(start, (err, files) => {
          if (err) {
            callback(err);
          }
          total = files.length;
          if (total === 0) {
            callback();
          }
          files.sort((a, b) => {
            if (a > b) {
              return 1;
            }
            if (a < b) {
              return -1;
            }
            return 0;
          });
          for (let x = 0, l = files.length; x < l; x++) {
            isDir(start, files[x]);
          }
        });
      } else {
        callback('Path: ' + start + ' is not a directory');
      }
    }
  );
}

export function readDirectory (dirPath, testFileNames = undefined) {
  return new Promise((resolve, reject) => {
    let result = { dirs: [], files: [] };
    readDirectoryTree(result, dirPath, err => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    }, testFileNames);
  });
}

export function readDirectoryFiles (dirPath, testFileNames = undefined) {
  return readDirectory(dirPath, testFileNames).then(dirTree => {
    let files = [];
    traverseDirTree(dirTree, (type, obj) => {
      if (type === 'file') {
        files.push(obj.filePath);
      }
    });
    return { files };
  });
}

export function readDirectoryFlat (dirPath) {
  return new Promise((resolve, reject) => {
    fs.lstat(dirPath, (err, stat) => {
      if (err) {
        reject(err);
      }
      let found = { files: [], dirs: [] },
        total = 0;

      // Read through all the files in this directory
      if (stat && stat.isDirectory()) {
        fs.readdir(dirPath, (err, files) => {
          total = files.length;
          if (total === 0) {
            resolve(found);
          }
          let tasks = [];
          for (let x = 0, l = files.length; x < l; x++) {
            let absPath = path.join(dirPath, files[x]).replace(/\\/g, '/');
            let fileName = files[x];
            tasks.push(
              new Promise((processed, failed) => {
                fs.stat(absPath, (err, stat) => {
                  if (err) {
                    failed(err);
                  }
                  if (stat.isDirectory()) {
                    found.dirs.push({
                      name: fileName,
                      path: absPath
                    });
                  } else {
                    found.files.push({
                      name: fileName,
                      path: absPath
                    });
                  }
                  processed(found);
                });
              })
            );
          }
          return Promise.all(tasks).then(() => {
            resolve(found);
          });
        });
      } else {
        reject('path: ' + dirPath + ' is not a directory');
      }

    });
  });
}

export function readDirFilesFlat (dirPath) {
  return new Promise((resolve, reject) => {
    fs.lstat(dirPath, (err, stat) => {
      if (err) {
        reject(err);
      }
      let found = [];
      // Read through all the files in this directory
      if (stat && stat.isDirectory()) {
        fs.readdir(dirPath, (dirErr, files) => {
          if (dirErr) {
            reject(dirErr);
          }
          if (files.length === 0) {
            resolve(found);
          }
          const tasks = [];
          files.forEach(file => {
            let absPath = path.join(dirPath, file).replace(/\\/g, '/');
            tasks.push(
              new Promise((done, failed) => {
                fs.lstat(absPath, (fileErr, fileStat) => {
                  if (fileErr) {
                    failed(fileErr);
                  }
                  if (!fileStat.isDirectory()) {
                    found.push(absPath);
                  }
                  done();
                });
              })
            );
          });
          Promise.all(tasks).then(() => { resolve(found); });
        });
      } else {
        reject('path: ' + dirPath + ' is not a directory');
      }
    });
  });
}

export function checkDirIsEmpty (dirPath) {
  return new Promise((resolve, reject) => {
    fs.stat(dirPath, (err, stat) => {
      if (err) {
        reject('Can not read directory. ' + err);
      } else {
        if (stat && stat.isDirectory()) {
          fs.readdir(dirPath, (err, files) => {
            let total = files.length;
            if (total === 0) {
              resolve();
            } else {
              reject(dirPath + ' is not empty');
            }
          });
        } else {
          reject(dirPath + ' is not a directory');
        }
      }
    });
  });
}

export function readJson (filePath) {
  return new Promise((resolve, reject) => {
    fs.readJson(filePath, (err, packageObj) => {
      if (err) {
        reject(err);
      } else {
        resolve(packageObj);
      }
    });
  });
}

export function writeJson (filePath, jsonObj) {
  return ensureFilePath(filePath)
    .then(() => {
      return new Promise((resolve, reject) => {
        fs.writeJson(filePath, jsonObj, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
}

export function removeFile (filePath) {
  return new Promise((resolve, reject) => {
    fs.remove(filePath, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function isFile (filePath) {
  return new Promise((resolve, reject) => {
    fs.lstat(filePath, (err, stat) => {
      if (err) {
        reject(err);
      } else {
        resolve(stat && !stat.isDirectory());
      }
    });
  });
}

export function repairPath (filePath) {
  if (filePath) {
    return filePath.replace(/\\/g, FILE_SEPARATOR);
  }
  return filePath;
}

export function removeFileAndEmptyDir (filePath, stopDirPath) {
  return removeFile(filePath)
    .then(() => {
      const dirName = path.dirname(filePath);
      if (stopDirPath && dirName !== stopDirPath) {
        return checkDirIsEmpty(dirName)
          .then(() => {
            return removeFileAndEmptyDir(dirName, stopDirPath);
          })
          .catch(error => {
            // do nothing because dir is not empty
          });
      }
    });
}

export function writeFileWhenDifferent (filePath, fileBody) {
  return readFile(filePath)
    .then(existingFileBody => {
      const existingFileBuffer = Buffer.from(existingFileBody);
      const newFileBuffer = Buffer.from(fileBody);
      if (!existingFileBuffer.equals(newFileBuffer)) {
        return ensureFilePath(filePath)
          .then(() => {
            return writeFile(filePath, fileBody);
          });
      }
    })
    .catch(() => {
      // there is no such file
      return ensureFilePath(filePath)
        .then(() => {
          return writeFile(filePath, fileBody);
        });
    });
}

export function unpackTarGz (srcFilePath, destDirPath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(srcFilePath)
      .pipe(zlib.createGunzip())
      .pipe(tar
        .extract(destDirPath, {
          readable: true, // all dirs and files should be readable
          writable: true, // all dirs and files should be writable
        })
        .on('finish', () => { resolve(); }))
      .on('error', err => { reject(err); });
  });
}

export function packTarGz (srcDirPath, destFilePath) {
  return new Promise((resolve, reject) => {
    let destFile = fs.createWriteStream(destFilePath);
    tar.pack(srcDirPath).pipe(zlib.createGzip()).pipe(destFile)
      .on('finish', () => { resolve(); })
      .on('error', err => { reject(err); });
  });
}

export function download(url, destDirPath) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      url,
      method: 'GET',
      headers: {
        'User-Agent': 'axios',
      },
      encoding: null
    };
    try {
      request(requestOptions)
        .on('error', (error) => {
          reject(error || 'Error downloading file');
        })
        .on('response', (response) => {
          if (response) {
            if (response.statusCode === 200) {
              const contentDisposition = response.headers['content-disposition'];
              const matches = /filename=(.*)/g.exec(contentDisposition);
              if (matches && matches.length > 1) {
                // create file write stream
                const destinationFile = repairPath(path.join(destDirPath, matches[1]));
                fs.ensureFileSync(destinationFile);
                const writer = fs.createWriteStream(destinationFile);
                writer.on('finish', () => {
                  resolve();
                });
                writer.on('error', (error) => {
                  reject(error || 'Error downloading file');
                });
                response.pipe(writer);
              } else {
                reject('Can not find file name in the response.');
              }
            } else {
              reject('Error downloading file: ' + response.statusCode);
            }
          } else {
            reject('Error downloading file');
          }
        })
    } catch (e) {
      console.error(e);
      reject('Error connection with server');
    }
  });
}

