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

import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import { getSourceAst } from '../utils/babelParser';
import { traverse } from '../utils/astUtils';
import { getWcdAnnotations } from '../utils/commentsUtils';

function testAnnotationsInComments(leadingComments, {rootDirPath, filePath}, declaration) {
  let wcdAnnotations = {};
  if (leadingComments && leadingComments.length > 0) {
    leadingComments.forEach(leadingComment => {
      if (leadingComment && leadingComment.value) {
        wcdAnnotations = { ...wcdAnnotations, ...getWcdAnnotations(leadingComment.value) };
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
