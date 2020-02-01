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

import { getSourceAst } from '../utils/babelParser';
import { getImportSpecifiers, getPropTypesObject } from './propTypesParserUtils';
import { traverseProperties } from './propTypesTransformer';

function getPropTypes(ast, importSpecifiers, pathsSpecifiers) {
  const result = [];
  if (ast && ast.body && ast.body.length > 0) {
    ast.body.forEach(node => {
      const {type, declaration} = node;
      if (type === 'ExportNamedDeclaration' && declaration && declaration.type === 'VariableDeclaration') {
        // prop types declaration should be only exported constant
        const {declarations: declarators} = declaration;
        if (declarators && declarators.length > 0) {
          const {type: declaratorType, id: declaratorId, init: declaratorInit} = declarators[0];
          if (declaratorType === 'VariableDeclarator' && declaratorInit && declaratorId) {
            let propTypesDeclaration = {
              name: declaratorId.name,
            };
            propTypesDeclaration = getPropTypesObject(
              declaratorInit, importSpecifiers, pathsSpecifiers, propTypesDeclaration
            );
            if (propTypesDeclaration.properties && propTypesDeclaration.properties.length > 0) {
              propTypesDeclaration.properties = traverseProperties(propTypesDeclaration.properties);
            }
            result.push(propTypesDeclaration);
          }
        }
      }
    });
  }
  return result;
}

export const findPropTypesDeclarations = (sourceCode, rootDirPath, filePath) => {
  // console.info('AST: ', JSON.stringify(getSourceAst(sourceCode), null, 4));
  const ast = getSourceAst(sourceCode);
  let importSpecifiers = getImportSpecifiers(ast, rootDirPath, filePath);
  return getPropTypes(ast, importSpecifiers, {rootDirPath, filePath});
};
