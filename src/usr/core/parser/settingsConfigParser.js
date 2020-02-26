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

import { getSourceAst } from '../utils/babelParser';
import { getDefaultPropsObject } from './defaultPropsParserUtils';
import { getImportSpecifiers, getPropTypesObject } from './propTypesParserUtils';
import { traverseProperties } from './propTypesTransformer';

function getPropTypes(ast, importSpecifiers) {
  const result = [];
  let propTypesDeclaration = {};
  if (ast && ast.body && ast.body.length > 0) {
    ast.body.forEach(node => {
      const {type, declaration, declarations} = node;
      if (type === 'ExportNamedDeclaration' && declaration && declaration.type === 'VariableDeclaration') {
        // prop types declaration should be only exported constant
        const {declarations: declarators} = declaration;
        if (declarators && declarators.length > 0) {
          const {type: declaratorType, id: declaratorId, init: declaratorInit} = declarators[0];
          if (declaratorType === 'VariableDeclarator' && declaratorInit && declaratorId && declaratorId.name === 'defaultSettings') {
            propTypesDeclaration.defaultProps = getDefaultPropsObject(declaratorInit);
          }
        }
      } else if (type === 'VariableDeclaration' && declarations && declarations.length > 0) {
        // prop types declaration should be only exported constant
        const { type: declaratorType, id: declaratorId, init: declaratorInit } = declarations[0];
        if (declaratorType === 'VariableDeclarator' && declaratorInit && declaratorId && declaratorId.name === 'SettingsProps') {
          propTypesDeclaration = {
            name: declaratorId.name,
          };
          propTypesDeclaration = getPropTypesObject(declaratorInit, importSpecifiers, propTypesDeclaration);
        }
      }
    });
  }
  if (propTypesDeclaration.properties && propTypesDeclaration.properties.length > 0) {
    propTypesDeclaration.properties =
      traverseProperties(propTypesDeclaration.properties, propTypesDeclaration.defaultProps);
  }
  result.push(propTypesDeclaration);
  return result;
}

export const findSettingsConfigDeclarations = (sourceCode, rootDirPath, filePath) => {
  // console.info('AST: ', JSON.stringify(getSourceAst(sourceCode), null, 4));
  const ast = getSourceAst(sourceCode);
  let importSpecifiers = getImportSpecifiers(ast, rootDirPath, filePath);
  return getPropTypes(ast, importSpecifiers);
};
