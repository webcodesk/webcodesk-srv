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

import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import { getSourceAst } from '../utils/babelParser';
import { traverse } from '../utils/astUtils';
import path from 'path-browserify';
import { getWcdAnnotations } from '../utils/commentsUtils';
import constants from '../../../commons/constants';
import { makeResourceModelCanonicalKey, makeResourceModelKey } from '../utils/resourceUtils';
import { repairPath } from "../utils/fileUtils";

function getAbsoluteImportPath (sourceImportPath, rootDirPath, currentFilePath) {
  let absoluteImportPath = repairPath(sourceImportPath);
  if (absoluteImportPath.charAt(0) === '.') {
    // we have relative import path
    const fileDirPath = path.dirname(currentFilePath);
    // need to resolve it to the absolute path
    absoluteImportPath = repairPath(path.resolve(fileDirPath, absoluteImportPath));
    // remove project root dir path part from the absolute path
    absoluteImportPath = absoluteImportPath
      .replace(`${rootDirPath}${constants.FILE_SEPARATOR}`, '');
  }
  return absoluteImportPath;
}

function testAnnotationsInComments(leadingComments, {rootDirPath, filePath}, declaration) {
  let wcdAnnotations = {};
  if (leadingComments && leadingComments.length > 0) {
    leadingComments.forEach(leadingComment => {
      if (leadingComment && leadingComment.value) {
        wcdAnnotations = { ...wcdAnnotations, ...getWcdAnnotations(leadingComment.value) };
        const connectReferences = wcdAnnotations[constants.ANNOTATION_CONNECT];
        if (connectReferences && connectReferences.length > 0) {
          declaration.possibleConnectionTargets = declaration.possibleConnectionTargets || {};
          let absoluteImportPath;
          for(let i = 0; i < connectReferences.length; i++) {
            const { connectName, connectTarget, connectTargetFilePath } = connectReferences[i];
            absoluteImportPath = getAbsoluteImportPath(connectTargetFilePath, rootDirPath, filePath);
            if (absoluteImportPath) {
              declaration.possibleConnectionTargets[connectName] =
                declaration.possibleConnectionTargets[connectName] || [];
              if (connectTarget) {
                declaration.possibleConnectionTargets[connectName].push(
                  makeResourceModelCanonicalKey(makeResourceModelKey(absoluteImportPath), connectTarget)
                );
              } else {
                declaration.possibleConnectionTargets[connectName].push(
                  makeResourceModelKey(absoluteImportPath)
                );
              }
            }
          }
          delete wcdAnnotations[constants.ANNOTATION_CONNECT];
        }
      }
    });
  }
  declaration.wcdAnnotations = wcdAnnotations;
  return declaration;
}

function getFunctionBodyDispatches(functionBodyAst) {
  let result = [];
  traverse(functionBodyAst, node => {
    if (node.type === 'ExpressionStatement') {
      const { expression } = node;
      if (expression && expression.type === 'CallExpression') {
        const { callee, arguments: expressionArguments } = expression;
        // see if the call is to dispatch
        if (callee && callee.type === 'Identifier' && callee.name === 'dispatch') {
          // there 2 arguments have to be
          if (expressionArguments && expressionArguments.length > 0) {
            const firstArgument = expressionArguments[0];
            if (firstArgument && firstArgument.type === 'ObjectExpression') {
              const { properties } = firstArgument;
              if (properties && properties.length > 0) {
                properties.forEach(property => {
                  const { type: propertyType, key: propertyKey } = property;
                  if (propertyType === 'ObjectProperty' && propertyKey && propertyKey.type === 'Identifier') {
                    let functionDispatchDeclaration = {};
                    // set dispatch declaration name
                    functionDispatchDeclaration.name = propertyKey.name;
                    result.push(functionDispatchDeclaration);
                  }
                });
              }
            }
          }
        }
      }
    }
  });
  result = uniqWith(result, isEqual);
  return result;
}

export const getFunctionDeclarations = (ast, pathsSpecifiers) => {
  const result = [];
  if (ast && ast.body && ast.body.length > 0) {
    ast.body.forEach(node => {
      if (node.type === 'ExportNamedDeclaration') {
        const {declaration, leadingComments} = node;
        // console.info('ExportNamedDeclaration passed');
        if (declaration && declaration.type === 'VariableDeclaration') {
          // console.info('VariableDeclaration passed');
          const {declarations} = declaration;
          if (declarations && declarations.length > 0) {
            const {type: varDeclarationType, id: varId, init: varInit,} = declarations[0];
            if (varDeclarationType === 'VariableDeclarator') {
              // console.info('VariableDeclarator passed');
              if (varId && varInit) {
                const {type: varIdType, name: varIdName} = varId;
                const {type: varInitType, params: varInitParams, body: varInitBody} = varInit;
                if (varIdType === 'Identifier' && varInitType === 'ArrowFunctionExpression') {
                  // console.info('Identifier & ArrowFunctionExpression passed');
                  let functionDeclaration = {};
                  // set user function name
                  functionDeclaration.functionName = varIdName;
                  // get parameters of the user function (arrow function)
                  if (varInitParams && varInitParams.length > 0) {
                    // functionDeclaration.parameters = [];
                    // varInitParams.forEach(varInitParam => {
                    //   functionDeclaration.parameters.push({
                    //     name: varInitParam.name,
                    //   });
                    // });
                  }
                  // add comments if there are some
                  functionDeclaration =
                    testAnnotationsInComments(leadingComments, pathsSpecifiers, functionDeclaration);
                  // check user function body, it has to be the arrow function with dispatch parameter
                  if (varInitBody) {
                    const {
                      type: varInitBodyType,
                      generator: varInitBodyGenerator,
                      params: varInitBodyParams,
                      body: varInitBodyBody,
                    } = varInitBody;
                    if (!varInitBodyGenerator && varInitBodyType === 'ArrowFunctionExpression') {
                      // console.info('varInitBodyGenerator & ArrowFunctionExpression passed');
                      if (varInitBodyParams && varInitBodyParams.length > 0) {
                        // see if the parameter of the nested function has dispatch name only
                        if (varInitBodyParams[0].type === 'Identifier' && varInitBodyParams[0].name === 'dispatch') {
                          // get dispatches inside the function body
                          functionDeclaration.dispatches = getFunctionBodyDispatches(varInitBodyBody);
                          // add possible connections to each dispatch
                          if (
                            functionDeclaration.possibleConnectionTargets
                            && functionDeclaration.dispatches
                            && functionDeclaration.dispatches.length > 0
                          ) {
                            for (let i = 0; i < functionDeclaration.dispatches.length; i++) {
                              functionDeclaration.dispatches[i].possibleConnectionTargets =
                                functionDeclaration.possibleConnectionTargets[functionDeclaration.dispatches[i].name];
                            }
                          }
                          // we don't need connection targets in the function declaration any more
                          delete functionDeclaration.possibleConnectionTargets;
                          // that's valid function declaration - we add it the list of user functions
                          result.push(functionDeclaration);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }
  return result;
};

export const findFunctionDeclarations = (sourceCode, rootDirPath, filePath) => {
  const ast = getSourceAst(sourceCode);
  return getFunctionDeclarations(ast, {rootDirPath, filePath});
};
