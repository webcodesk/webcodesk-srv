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
