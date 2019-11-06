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
import { traverse } from '../utils/astUtils';
import { getImportSpecifiers, getPropTypesObject } from './propTypesParserUtils';
import { getDefaultPropsObject } from './defaultPropsParserUtils';
import { traverseProperties } from './propTypesTransformer';

const getPropTypesOutOfBody = (ast, classDeclarationName, importSpecifiers, classDeclaration = {}) => {
  if (!ast) {
    return classDeclaration;
  }
  traverse(ast, node => {
    if (node.type === 'ExpressionStatement' && node.expression && node.expression.type === 'AssignmentExpression') {
      const { expression: {left, right} } = node;
      if (left) {
        const { type: leftType, object: leftObject, property: leftProperty } = left;
        if (leftType === 'MemberExpression'
          && leftObject
          && leftObject.type === 'Identifier'
          && leftObject.name === classDeclarationName) {
          // here we have class member assignment
          if (leftProperty && leftProperty.type === 'Identifier') {
            if (leftProperty.name === 'propTypes') {
              // this is definitely a propTypes assignment, now read the right object definition
              if (right) {
                classDeclaration = getPropTypesObject(right, importSpecifiers, classDeclaration);
              }
            } else if (leftProperty.name === 'defaultProps') {
              // this is definitely a defaultProps assignment, now read the right object definition
              classDeclaration.defaultProps = getDefaultPropsObject(right);
            }
          }
        }
      }
    }
  });
  if (classDeclaration.properties && classDeclaration.properties.length > 0) {
    classDeclaration.properties =
      traverseProperties(classDeclaration.properties);
  }
  return classDeclaration;
};

const getPropTypesInBody = (astNode, importSpecifiers, classDeclaration = {}) => {
  if (!astNode) {
    return classDeclaration;
  }
  const { body: classBodyContent } = astNode;
  if (classBodyContent && classBodyContent.length > 0) {
    classBodyContent.forEach(bodyItem => {
      const { type: bodyItemType, key: bodyItemKey, value: bodyItemValue } = bodyItem;
      if (bodyItemType === 'ClassProperty') {
        if (bodyItemKey && bodyItemKey.type === 'Identifier' && bodyItemValue) {
          if (bodyItemKey.name === 'propTypes') {
            // here propTypes declaration should be
            classDeclaration = getPropTypesObject(bodyItemValue, importSpecifiers, classDeclaration);
          } else if (bodyItemKey.name === 'defaultProps') {
            // here defaultProps declaration should be
            classDeclaration.defaultProps = getDefaultPropsObject(bodyItemValue);
          }
        }
      }
    });
  }
  if (classDeclaration.properties && classDeclaration.properties.length > 0) {
    classDeclaration.properties =
      traverseProperties(classDeclaration.properties);
  }
  return classDeclaration;
};

const isSuperClassReactComponent = (astNode) => {
  if (!astNode) {
    return false;
  }
  const { type: superClassType, object: superClassObject, property: superClassProperty } = astNode;
  if (superClassType === 'MemberExpression') {
    // here we may have "React.Component" class inheritance
    if (superClassObject
      && superClassObject.name === 'React'
      && superClassProperty
      && superClassProperty.name === 'Component') {
      return true;
    }
  }
};

const getClassDeclaration = (ast, componentName, importSpecifiers) => {
  const classDeclarations = {};
  let foundClassDeclaration = null;
  if (ast && ast.body && ast.body.length > 0) {
    ast.body.forEach(node => {
      // search for the class declarations
      if (node.type === 'ClassDeclaration') {
        const {
          id: classDeclarationId,
          superClass: classDeclarationSuperClass,
          body: classDeclarationBody,
          leadingComments: classDeclarationComments
        } = node;
        if (isSuperClassReactComponent(classDeclarationSuperClass)) {
          // this class is inherited from React Component
          let classDeclaration = {
            componentName: classDeclarationId.name,
          };
          classDeclaration = getPropTypesInBody(classDeclarationBody, importSpecifiers, classDeclaration);
          // get comments
          if (classDeclarationComments && classDeclarationComments.length > 0) {
            classDeclaration.comments = classDeclarationComments.map(comment => comment.value);
          }
          // set found class declaration
          classDeclarations[classDeclaration.componentName] = classDeclaration;
        }
      }
      // search for the default export name
      if (node.type === 'ExportDefaultDeclaration') {
        // todo: should we find somehow what exactly the class name is exported as default?
        // const { declaration: defaultExportDeclaration } = node;
        // defaultExports[defaultExportDeclaration.name] = true;
        // now just set the last we found in the body
        // and with the equal name to the file name
        if (classDeclarations[componentName]) {
          foundClassDeclaration = classDeclarations[componentName];
        }
      }
    });
  }
  return foundClassDeclaration;
};

const findConstFunctionDeclaration = (ast, componentName) => {
  const functionsDeclarations = {};
  let foundDeclaration = null;

  if (ast && ast.body && ast.body.length > 0) {
    ast.body.forEach(node => {
      const { type, declarations: bodyDeclarations, leadingComments } = node;
      if (type === 'VariableDeclaration' && bodyDeclarations && bodyDeclarations.length > 0) {
        const { type: declaratorType, init: declaratorInit, id: declaratorId } = bodyDeclarations[0];
        if (declaratorType === 'VariableDeclarator' &&
          declaratorInit &&
          declaratorInit.type === 'ArrowFunctionExpression') {
          // have arrow function declaration...
          if (declaratorId && declaratorId.name === componentName) {
            // arrow function has name equal to the file name
            functionsDeclarations[declaratorId.name] = {
              componentName: declaratorId.name,
            };
            // get comments
            if (leadingComments && leadingComments.length > 0) {
              functionsDeclarations[declaratorId.name].comments = leadingComments.map(comment => comment.value);
            }
          }
        }
      } else if (type === 'ExportDefaultDeclaration') {
        if (functionsDeclarations[componentName]) {
          foundDeclaration = functionsDeclarations[componentName];
        }
      }
    });
  }
  return foundDeclaration;
};

const findAllPossibleComponentDeclarations = (ast, componentName, importSpecifiers) => {
  const result = [];
  let foundClassDeclaration = getClassDeclaration(ast, componentName, importSpecifiers);
  if (foundClassDeclaration) {
    if ((!foundClassDeclaration.properties || foundClassDeclaration.properties.length === 0)
      && !foundClassDeclaration.externalProperties) {
      // probably the propTypes are declared outside the class declaration block
      foundClassDeclaration = getPropTypesOutOfBody(ast, componentName, importSpecifiers, foundClassDeclaration);
    }
    result.push(foundClassDeclaration);
  } else {
    let foundFunctionDeclaration = findConstFunctionDeclaration(ast, componentName);
    if (foundFunctionDeclaration) {
      // the propTypes should be declared outside the function declaration block
      foundFunctionDeclaration = getPropTypesOutOfBody(ast, componentName, importSpecifiers, foundFunctionDeclaration);
      result.push(foundFunctionDeclaration);
    }
  }
  return result;
};

export const findComponentDeclarations = (sourceCode, rootDirPath, filePath, componentName) => {
  const ast = getSourceAst(sourceCode);
  const importSpecifiers = getImportSpecifiers(ast, rootDirPath, filePath);
  return findAllPossibleComponentDeclarations(ast, componentName, importSpecifiers);
};
