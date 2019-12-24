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

/* eslint-disable no-useless-escape */
import constants from '../../../commons/constants';

const newLineRegExp = new RegExp(/\r?\n/);
const paramLineRegExp = new RegExp('@functionTypes\?.*', 'i');
const paramTypeRegExp = new RegExp('\{([^}]+)\}', 'i');

export const getWcdAnnotations = (commentRawValue) => {
  const result = {};
  let validCommentLines = commentRawValue.split(newLineRegExp);
  let concatenatedCommentLine;
  let testCommentLine;
  if (validCommentLines && validCommentLines.length > 0) {
    concatenatedCommentLine = '';
    validCommentLines.forEach(commentLine => {
      testCommentLine = commentLine.trim();
      if (testCommentLine.charAt(0) === '*') {
        testCommentLine = testCommentLine.substring(1);
      }
      paramLineRegExp.lastIndex = 0;
      const matches = paramLineRegExp.exec(testCommentLine);
      if (matches && matches.length > 0) {
        paramTypeRegExp.lastIndex = 0;
        const paramTypesMatches = paramTypeRegExp.exec(matches[0]);
        if (paramTypesMatches && paramTypesMatches.length > 0) {
          result[constants.ANNOTATION_FUNCTION_ARGUMENT_PROP_TYPES] = paramTypesMatches[0]
            .substring(1, paramTypesMatches[0].length - 1)
            .trim()
            .split(' ');
        }
      } else {
        concatenatedCommentLine += `${testCommentLine}\n`;
      }
    });
    if (concatenatedCommentLine && concatenatedCommentLine.length > 1) {
      concatenatedCommentLine = concatenatedCommentLine.substring(0, concatenatedCommentLine.length - 1);
      result[constants.ANNOTATION_COMMENT] = concatenatedCommentLine;
    }
  }
  return result;
};
