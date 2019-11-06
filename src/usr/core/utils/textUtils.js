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

import prettier from 'prettier/standalone';
import prettierBabylon from 'prettier/parser-babylon';
import * as constants from '../../../commons/constants';

export function cutText(text, limit = 30) {
  if (text && text.length >= limit) {
    return text.substr(0, limit - 3) + '...';
  }
  return text;
}

export function getParticleName(canonicalName) {
  const titleParts = canonicalName ? canonicalName.split('.') : [];
  if (titleParts.length > 0) {
    return titleParts[titleParts.length - 1];
  }
  return canonicalName;
}

export function cutPagePath(filePath, limit = 60, trimTo = 5) {
  let result = filePath;
  if (result && result.length > limit && trimTo > 1) {
    const parts = result.split(constants.FILE_SEPARATOR);
    if (parts && parts.length > trimTo) {
      result = `...${constants.FILE_SEPARATOR}${parts.slice(parts.length - trimTo, parts.length).join(constants.FILE_SEPARATOR)}`;
      if (result.length > limit) {
        return cutPagePath(result, limit, trimTo - 1);
      }
    }
  }
  return result;
}

const reservedWords = [
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'new',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
  'enum',
  'implements',
  'interface',
  'let',
  'package',
  'private',
  'protected',
  'await',
  // 'abstract',
  // 'boolean',
  // 'byte',
  // 'char',
  // 'double',
  // 'final',
  // 'float',
  // 'goto',
  // 'int',
  // 'long',
  // 'native',
  // 'short'
  'index' // this is an extra word for prohibited file names
];

export function testReservedName(name) {
  return reservedWords.indexOf(name) >= 0;
}

export function format(text) {
  return prettier.format(text, {
    parser: 'babylon',
    plugins: [prettierBabylon],
    singleQuote: true,
    tabWidth: 2,
  });
}
