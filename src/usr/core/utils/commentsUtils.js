/* eslint-disable no-useless-escape */
import constants from '../../../commons/constants';

const newLineRegExp = new RegExp(/\r?\n/);
const paramLineRegExp = new RegExp('@param\?.*', 'i');
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
