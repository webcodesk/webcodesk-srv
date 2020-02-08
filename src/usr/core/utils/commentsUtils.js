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
      concatenatedCommentLine += `${testCommentLine}\n`;
    });
    if (concatenatedCommentLine && concatenatedCommentLine.length > 1) {
      concatenatedCommentLine = concatenatedCommentLine.substring(0, concatenatedCommentLine.length - 1);
      result[constants.ANNOTATION_COMMENT] = concatenatedCommentLine;
    }
  }
  return result;
};
