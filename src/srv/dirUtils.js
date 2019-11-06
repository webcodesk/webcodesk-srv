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

import fs from 'fs-extra';
import path from 'path';
import minimatch from 'minimatch';

function patternMatcher(pattern) {
  return function(pathValue, stats) {
    const minimatcher = new minimatch.Minimatch(pattern, { matchBase: true });
    return (!minimatcher.negate || stats.isFile()) && minimatcher.match(pathValue);
  };
}

function toMatcherFunction(ignoreEntry) {
  if (typeof ignoreEntry === "function") {
    return ignoreEntry;
  } else {
    return patternMatcher(ignoreEntry);
  }
}

export function readDir(pathValue, ignores, callback) {
  if (typeof ignores === "function") {
    callback = ignores;
    ignores = [];
  }

  if (!callback) {
    return new Promise(function(resolve, reject) {
      readDir(pathValue, ignores || [], function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  ignores = ignores.map(toMatcherFunction);

  let list = [];

  fs.readdir(pathValue, function(err, files) {
    if (err) {
      return callback(err);
    }

    let pending = files.length;
    if (!pending) {
      return callback(null, list);
    }

    files.forEach(function(file) {
      const filePath = path.join(pathValue, file);
      fs.stat(filePath, function(_err, stats) {
        if (_err) {
          return callback(_err);
        }

        if (
          ignores.some(function(matcher) {
            return matcher(filePath, stats);
          })
        ) {
          pending -= 1;
          if (!pending) {
            return callback(null, list);
          }
          return null;
        }

        if (stats.isDirectory()) {
          readDir(filePath, ignores, function(__err, res) {
            if (__err) {
              return callback(__err);
            }

            list = list.concat(res);
            pending -= 1;
            if (!pending) {
              return callback(null, list);
            }
          });
        } else {
          list.push(filePath);
          pending -= 1;
          if (!pending) {
            return callback(null, list);
          }
        }
      });
    });
  });
}
