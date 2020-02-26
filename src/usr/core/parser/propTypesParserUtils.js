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

import path from 'path-browserify';
import constants from '../../../commons/constants';
import { makeResourceModelCanonicalKey, makeResourceModelKey } from '../utils/resourceUtils';
import { getWcdAnnotations } from '../utils/commentsUtils';
import { repairPath } from "../utils/fileUtils";

const identifierTypeMap = {
  'func': constants.COMPONENT_PROPERTY_FUNCTION_TYPE,
  'element': constants.COMPONENT_PROPERTY_ELEMENT_TYPE,
  'node': constants.COMPONENT_PROPERTY_NODE_TYPE,
  'any': constants.COMPONENT_PROPERTY_ANY_TYPE,
  'array': constants.COMPONENT_PROPERTY_ARRAY_TYPE,
  'bool': constants.COMPONENT_PROPERTY_BOOL_TYPE,
  'number': constants.COMPONENT_PROPERTY_NUMBER_TYPE,
  'string': constants.COMPONENT_PROPERTY_STRING_TYPE,
  'object': constants.COMPONENT_PROPERTY_OBJECT_TYPE,
  'symbol': constants.COMPONENT_PROPERTY_SYMBOL_TYPE,
  'shape': constants.COMPONENT_PROPERTY_SHAPE_TYPE,
  'arrayOf': constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE,
  'oneOf': constants.COMPONENT_PROPERTY_ONE_OF_TYPE,
};

function getAbsoluteImportPath (sourceImportPath, rootDirPath, currentFilePath) {
  sourceImportPath = repairPath(sourceImportPath);
  let absoluteImportPath;
  if (!sourceImportPath || sourceImportPath.length === 0) {
    // we have the import from the same file
    // remove project root dir path part from the absolute path
    absoluteImportPath = repairPath(currentFilePath.replace(`${rootDirPath}${constants.FILE_SEPARATOR}`, ''));
  } else {
    if (sourceImportPath.charAt(0) === '.') {
      // we have relative import path
      const fileDirPath = path.dirname(currentFilePath);
      // need to resolve it to the absolute path
      absoluteImportPath = repairPath(path.resolve(fileDirPath, sourceImportPath));
      // remove project root dir path part from the absolute path
      absoluteImportPath = absoluteImportPath
        .replace(`${rootDirPath}${constants.FILE_SEPARATOR}`, '');
    } else {
      absoluteImportPath = sourceImportPath;
    }
  }
  return absoluteImportPath;
}

function getExternalPropTypesImport (name, importSpecifiers) {
  let result = null;
  const externalPropTypesImport = importSpecifiers[name];
  if (externalPropTypesImport) {
    // we have to use common resource keys for the imported values in the props
    // then we can find the PropTypes resource description in the graph model
    result = makeResourceModelCanonicalKey(
      makeResourceModelKey(externalPropTypesImport.importPath),
      name
    );
  }
  return result;
}

function testPropertyIdentifier (node, importSpecifiers) {
  let result = null;
  if (node) {
    const { type, name } = node;
    if (type === 'Identifier' && name) {
      result = getExternalPropTypesImport(name, importSpecifiers);
    }
  }
  return result;
}

function testCallExpression (node, importSpecifiers, pathsSpecifiers, propTypesDeclaration = {}) {
  if (node) {
    const { type, callee, arguments: calleeArgs } = node;
    if (type === 'CallExpression' && callee) {
      const { type: calleeType, object: calleeObject, property: calleeProperty } = callee;
      if (calleeType === 'MemberExpression' && calleeObject && calleeProperty) {
        if (calleeObject.type === 'Identifier' && calleeObject.name === 'PropTypes') {
          const { type: propertyType, name: propertyName } = calleeProperty;
          if (propertyType === 'Identifier') {
            propTypesDeclaration.type = identifierTypeMap[propertyName] || constants.COMPONENT_PROPERTY_ANY_TYPE;
            if (calleeArgs && calleeArgs.length > 0) {
              const { type: calleeArgumentType } = calleeArgs[0];
              if (calleeArgumentType === 'Identifier') {
                const externalProperties = testPropertyIdentifier(calleeArgs[0], importSpecifiers);
                if (externalProperties) {
                  propTypesDeclaration.externalProperties = externalProperties;
                }
              } else if (calleeArgumentType === 'CallExpression') {
                propTypesDeclaration.properties =
                  [testCallExpression(calleeArgs[0], importSpecifiers, pathsSpecifiers)];
              } else if (calleeArgumentType === 'ObjectExpression') {
                propTypesDeclaration =
                  testObjectExpression(calleeArgs[0], importSpecifiers, pathsSpecifiers, propTypesDeclaration);
              } else if (calleeArgumentType === 'MemberExpression') {
                propTypesDeclaration.properties =
                  [testMemberExpression(calleeArgs[0], importSpecifiers, pathsSpecifiers)];
              } else if (calleeArgumentType === 'ArrayExpression') {
                propTypesDeclaration.variants =
                  testArrayExpression(calleeArgs[0]);
              }
            }
          }
        }
      }
    }
  }
  return propTypesDeclaration;
}

function testArrayExpression (node) {
  const arrayElementValues = [];
  if (node) {
    const { type, elements } = node;
    if (type === 'ArrayExpression' && elements && elements.length > 0) {
      elements.forEach(arrayElement => {
        if (arrayElement) {
          const { type: elementType, value: elementValue } = arrayElement;
          if (elementType === 'StringLiteral' && typeof elementValue !== 'undefined') {
            // we take strings as variant values
            arrayElementValues.push({
              value: elementValue,
            });
          } else if (elementType === 'NumericLiteral') {
            // we take numbers as variant values
            arrayElementValues.push({
              value: elementValue,
            });
          }
        }
      });
    }
  }
  return arrayElementValues;
}

function testMemberExpression (node, importSpecifiers, pathsSpecifiers, propTypesDeclaration = {}) {
  if (node) {
    const { type, object, property } = node;
    if (type === 'MemberExpression') {
      const { type: objectType } = object;
      if (objectType === 'Identifier') {
        // simple value in PropTypes.*
        const { name: objectName } = object;
        const { type: propertyType, name: propertyName } = property;
        if (objectName === 'PropTypes' && propertyType === 'Identifier') {
          propTypesDeclaration.type = identifierTypeMap[propertyName] || constants.COMPONENT_PROPERTY_ANY_TYPE;
        }
      } else if (objectType === 'CallExpression') {
        // PropTypes.*.isRequired
        const { type: propertyType, name: propertyName } = property;
        if (propertyType === 'Identifier' && propertyName === 'isRequired') {
          propTypesDeclaration.isRequired = true;
        }
        propTypesDeclaration = testCallExpression(
          object, importSpecifiers, pathsSpecifiers, propTypesDeclaration
        );
      } else if (objectType === 'MemberExpression') {
        // PropTypes.*.isRequired
        const { type: propertyType, name: propertyName } = property;
        if (propertyType === 'Identifier' && propertyName === 'isRequired') {
          propTypesDeclaration.isRequired = true;
        }
        propTypesDeclaration = testMemberExpression(
          object, importSpecifiers, pathsSpecifiers, propTypesDeclaration
        );
      }
    }
  }
  return propTypesDeclaration;
}

function testObjectPropertyValue (node, importSpecifiers, pathsSpecifiers, propTypesDeclaration = {}) {
  if (node) {
    const { type } = node;
    if (type === 'MemberExpression') {
      return testMemberExpression(node, importSpecifiers, pathsSpecifiers, propTypesDeclaration);
    } else if (type === 'CallExpression') {
      return testCallExpression(node, importSpecifiers, pathsSpecifiers, propTypesDeclaration);
    } else if (type === 'Identifier') {
      // it is prohibited to use a plain object as the field value in the prop types object
      // use Prop.Types.shape()
      return propTypesDeclaration;
    }
  }
}

function testObjectProperty (node, importSpecifiers, pathsSpecifiers, propTypesDeclaration = {}) {
  if (node) {
    const { type, key, value, leadingComments } = node;
    if (type === 'ObjectProperty' && key && key.type === 'Identifier' && value) {
      const { type: valueType } = value;
      // it is prohibited to use a plain object as the field value in the prop types object
      // use Prop.Types.shape()
      if (valueType !== 'Identifier') {
        propTypesDeclaration.name = key.name;
        // get comments
        let wcdAnnotations = {};
        if (leadingComments && leadingComments.length > 0) {
          leadingComments.forEach(leadingComment => {
            if (leadingComment && leadingComment.value) {
              wcdAnnotations = { ...wcdAnnotations, ...getWcdAnnotations(leadingComment.value) };
            }
          });
        }
        propTypesDeclaration.wcdAnnotations = wcdAnnotations;
        propTypesDeclaration = testObjectPropertyValue(
          value, importSpecifiers, pathsSpecifiers, propTypesDeclaration
        );
      } else {
        propTypesDeclaration = null;
      }
    }
  }
  return propTypesDeclaration;
}

function testObjectExpression (node, importSpecifiers, pathsSpecifiers, propTypesDeclaration = {}) {
  if (node) {
    const { type, properties } = node;
    if (type === 'ObjectExpression' && properties && properties.length > 0) {
      propTypesDeclaration.properties = [];
      let propertyValueObject;
      properties.forEach(property => {
        if (property) {
          propertyValueObject = testObjectProperty(property, importSpecifiers, pathsSpecifiers);
          if (propertyValueObject) {
            propTypesDeclaration.properties.push(propertyValueObject);
          }
        }
      });
    }
  }
  return propTypesDeclaration;
}

// function getAnnotationImportSpecifiers (ast, rootDirPath, filePath) {
//   const importSpecifiers = {};
//   traverse(ast, node => {
//     const { type, key, value, leadingComments } = node;
//     if (type === 'ObjectProperty' && key && key.type === 'Identifier' && value) {
//       // get comments
//       if (leadingComments && leadingComments.length > 0) {
//         let wcdAnnotations = {};
//         leadingComments.forEach(leadingComment => {
//           if (leadingComment && leadingComment.value) {
//             wcdAnnotations = { ...wcdAnnotations, ...getWcdAnnotations(leadingComment.value) };
//           }
//         });
//         if (wcdAnnotations[constants.ANNOTATION_FUNCTION_ARGUMENT_PROP_TYPES]) {
//           const annotationParts =
//             wcdAnnotations[constants.ANNOTATION_FUNCTION_ARGUMENT_PROP_TYPES];
//           if (annotationParts.length === 3) {
//             // there should be: PropTypesVariableName from some/path/to/File
//             // there should be: PropTypesVariableName from ./FilePath
//             // [0]: PropTypesVariableName
//             // [2]: ./FilePath
//             importSpecifiers[annotationParts[0]] = {
//               importName: annotationParts[0],
//               importPath: getAbsoluteImportPath(annotationParts[2], rootDirPath, filePath),
//             };
//           } else if (annotationParts.length === 1) {
//             // there should be: PropTypesVariableName
//             // [0]: PropTypesVariableName
//             importSpecifiers[annotationParts[0]] = {
//               importName: annotationParts[0],
//               importPath: getAbsoluteImportPath('', rootDirPath, filePath),
//             };
//           }
//         }
//       }
//     }
//   });
//   return importSpecifiers;
// }

function getLocals (ast, rootDirPath, filePath) {
  const localSpecifiers = {};
  const filePathParsed = path.parse(filePath);
  const dirName = filePathParsed.dir.replace(`${rootDirPath}${constants.FILE_SEPARATOR}`, '');
  const importPath = `${dirName}${constants.FILE_SEPARATOR}${filePathParsed.name}`;
  if (ast && ast.body && ast.body.length > 0) {
    ast.body.forEach(node => {
      const { type, declaration } = node;
      if (type === 'ExportNamedDeclaration' && declaration && declaration.type === 'VariableDeclaration') {
        // treat the exported constant as the local import with the current file import path
        const { declarations: variableDeclarations } = declaration;
        if (variableDeclarations && variableDeclarations.length > 0) {
          const { type: declarationType, id: declarationId } = variableDeclarations[0];
          if (declarationType === 'VariableDeclarator' && declarationId && declarationId.type === 'Identifier') {
            localSpecifiers[declarationId.name] = {
              importName: declarationId.name,
              importPath: importPath,
            };
          }
        }
      }
    });
  }
  return localSpecifiers;
}

function getImports (ast, rootDirPath, filePath) {
  const importSpecifiers = {};
  if (ast && ast.body && ast.body.length > 0) {
    ast.body.forEach(node => {
      const { type, specifiers, source } = node;
      if (type === 'ImportDeclaration' && specifiers && specifiers.length > 0 && source && source.value) {
        // optimistically say that import has base dir import path
        const absoluteImportPath = getAbsoluteImportPath(source.value, rootDirPath, filePath);
        specifiers.forEach(specifier => {
          const { type, imported } = specifier;
          if (type === 'ImportSpecifier' && imported && imported.type === 'Identifier') {
            importSpecifiers[imported.name] = {
              importName: imported.name,
              importPath: absoluteImportPath,
            };
          }
        });
      }
    });
  }
  return importSpecifiers;
}

export function getImportSpecifiers (ast, rootDirPath, filePath) {
  let importSpecifiers = getImports(ast, rootDirPath, filePath);
  importSpecifiers = {
    ...importSpecifiers,
    // treat the local prop types definitions as local imports to be able find them as the external prop types
    ...getLocals(ast, rootDirPath, filePath),
    // and make @functionTypes annotation as the import specifier too
    // ...getAnnotationImportSpecifiers(ast, rootDirPath, filePath)
  };
  return importSpecifiers;
}

export function getPropTypesObject (node, importSpecifiers, pathsSpecifiers, propTypesDeclaration = {}) {
  if (node) {
    const { type, name } = node;
    if (type === 'ObjectExpression') {
      propTypesDeclaration = testObjectExpression(node, importSpecifiers, pathsSpecifiers, propTypesDeclaration);
    } else if (type === 'CallExpression') {
      propTypesDeclaration.properties = [testCallExpression(node, importSpecifiers, pathsSpecifiers)];
    } else if (type === 'Identifier') {
      const externalPropTypesImport = importSpecifiers[name];
      if (externalPropTypesImport) {
        // we have to use common resource keys for the imported values in the props
        // then we can find the PropTypes resource description in the graph model
        propTypesDeclaration.externalProperties = makeResourceModelCanonicalKey(
          makeResourceModelKey(externalPropTypesImport.importPath),
          name,
        );
      }
    }

  }
  return propTypesDeclaration;
}
