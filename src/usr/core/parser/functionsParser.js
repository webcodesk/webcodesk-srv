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

function getAnnotationImportSpecifiers (ast, rootDirPath, filePath) {
  const importSpecifiers = {};
  traverse(ast, node => {
    const {type, leadingComments} = node;
    if (type === 'ExpressionStatement' || type === 'ExportNamedDeclaration') {
      // get comments
      if (leadingComments && leadingComments.length > 0) {
        let wcdAnnotations = {};
        leadingComments.forEach(leadingComment => {
          if (leadingComment && leadingComment.value) {
            wcdAnnotations = {...wcdAnnotations, ...getWcdAnnotations(leadingComment.value)};
          }
        });
        if (wcdAnnotations[constants.ANNOTATION_FUNCTION_ARGUMENT_PROP_TYPES]) {
          if (wcdAnnotations[constants.ANNOTATION_FUNCTION_ARGUMENT_PROP_TYPES].length === 3) {
            const annotationParts = wcdAnnotations[constants.ANNOTATION_FUNCTION_ARGUMENT_PROP_TYPES];
            // there should be: PropTypesVariableName from some/path/to/File
            // there should be: PropTypesVariableName from ./FilePath
            // [0]: PropTypesVariableName
            // [2]: ./FilePath
            importSpecifiers[annotationParts[0]] = {
              importName: annotationParts[0],
              importPath: getAbsoluteImportPath(annotationParts[2], rootDirPath, filePath),
            };
          }
        }
      }
    }
  });
  return importSpecifiers;
}

function getExternalPropTypesImport(name, importSpecifiers) {
  let result = null;
  const externalPropTypesImport = importSpecifiers[name];
  if (externalPropTypesImport) {
    // we have to use common resource keys for the imported values in the props
    // then we can find the PropTypes resource description in the graph model
    result = makeResourceModelCanonicalKey(
      makeResourceModelKey(externalPropTypesImport.importPath),
      name
    )
  }
  return result;
}

function testAnnotationsInComments(leadingComments, importSpecifiers, declaration) {
  let wcdAnnotations = {};
  if (leadingComments && leadingComments.length > 0) {
    leadingComments.forEach(leadingComment => {
      if (leadingComment && leadingComment.value) {
        wcdAnnotations = { ...wcdAnnotations, ...getWcdAnnotations(leadingComment.value) };
      }
    });
    // todo: add compatibility paths from annotations
    // if (wcdAnnotations[constants.ANNOTATION_FUNCTION_ARGUMENT_PROP_TYPES]) {
    //   if (wcdAnnotations[constants.ANNOTATION_FUNCTION_ARGUMENT_PROP_TYPES].length === 3) {
    //     const annotationParts = wcdAnnotations[constants.ANNOTATION_FUNCTION_ARGUMENT_PROP_TYPES];
    //     const externalProperties = getExternalPropTypesImport(annotationParts[0], importSpecifiers);
    //     if (externalProperties) {
    //       declaration.externalProperties = externalProperties;
    //     }
    //   }
    //   // we don't need this annotation any more - we resolve prop types for the argument
    //   delete wcdAnnotations[constants.ANNOTATION_FUNCTION_ARGUMENT_PROP_TYPES];
    // }
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

export const getFunctionDeclarations = (ast, importSpecifiers) => {
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
                    // todo: removing isUsingTargetState
                    // if (varInitParams.length > 1) {
                    //   // the user wants to use the target state in the function
                    //   functionDeclaration.isUsingTargetState = true;
                    // }
                  }
                  // add comments if there are some
                  functionDeclaration =
                    testAnnotationsInComments(leadingComments, importSpecifiers, functionDeclaration);
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
  const importSpecifiers = getAnnotationImportSpecifiers(ast, rootDirPath, filePath);
  return getFunctionDeclarations(ast, importSpecifiers);
};
