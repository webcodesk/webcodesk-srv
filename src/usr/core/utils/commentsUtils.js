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

const PARAM_KEYWORD_WITH = 'to';
const PARAM_KEYWORD_FROM = 'from';

const newLineRegExp = new RegExp(/\r?\n/);
const paramLineRegExp = new RegExp('@connect\?.*', 'i');
// const paramTypeRegExp = new RegExp('\{([^}]+)\}', 'i');

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
        const paramValueParts = matches[0].trim().split(' ');
        if (
          paramValueParts.length === 5
          && paramValueParts[1] === PARAM_KEYWORD_WITH
          && paramValueParts[3] === PARAM_KEYWORD_FROM
        ) {
          // we have the component's function connect parameter to user function
          // example: @connect to Function from usr/dir/dir/Component.comp.js
          result[constants.ANNOTATION_CONNECT] = result[constants.ANNOTATION_CONNECT] || [];
          result[constants.ANNOTATION_CONNECT].push({
            connectTarget: paramValueParts[2].trim(),
            connectTargetFilePath: paramValueParts[4].trim(),
          });
        } else if (
          paramValueParts.length === 4
          && paramValueParts[2] === PARAM_KEYWORD_WITH
        ) {
          // we have user function connect parameter to component instance
          // example: @connect dispatchName to usr/dir/dir/Component.comp.js
          result[constants.ANNOTATION_CONNECT] = result[constants.ANNOTATION_CONNECT] || [];
          result[constants.ANNOTATION_CONNECT].push({
            connectName: paramValueParts[1].trim(),
            connectTargetFilePath: paramValueParts[3].trim(),
          });
        } else if (
          paramValueParts.length === 6
          && paramValueParts[2] === PARAM_KEYWORD_WITH
          && paramValueParts[4] === PARAM_KEYWORD_FROM
        ) {
          // we have user function connect parameter to another function
          // example: @connect dispatchName to Component from usr/dir/dir/Component.comp.js
          result[constants.ANNOTATION_CONNECT] = result[constants.ANNOTATION_CONNECT] || [];
          result[constants.ANNOTATION_CONNECT].push({
            connectName: paramValueParts[1].trim(),
            connectTarget: paramValueParts[3].trim(),
            connectTargetFilePath: paramValueParts[5].trim(),
          });
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
