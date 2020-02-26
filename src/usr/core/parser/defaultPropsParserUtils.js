
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

function testJSXElement(node) {
  if (node && node.type === 'JSXElement') {
    return {};
  }
}

function testArrayExpression(node, defaultPropsDeclaration = []) {
  if (node) {
    const {type, elements} = node;
    if (type === 'ArrayExpression' && elements && elements.length > 0) {
      elements.forEach(elementItem => {
        if (elementItem.type === 'StringLiteral'
          || elementItem.type === 'NumericLiteral') {
          defaultPropsDeclaration.push(testPrimitive(elementItem));
        } else if (elementItem.type === 'ObjectExpression') {
          defaultPropsDeclaration.push(testObjectExpression(elementItem));
        } else if (elementItem.type === 'ArrayExpression') {
          defaultPropsDeclaration.push(testArrayExpression(elementItem));
        } else if (elementItem.type === 'JSXElement') {
          defaultPropsDeclaration.push(testJSXElement(elementItem));
        }
      });
    }
  }
  return defaultPropsDeclaration;
}

function testPrimitive(node) {
  if (node) {
    const {type, value} = node;
    if (type === 'StringLiteral'
      || type === 'NumericLiteral'
      || type === 'BooleanLiteral') {
      return value;
    }
  }
}

function testObjectPropertyValue(node, defaultPropsDeclaration = {}) {
  if (node) {
    const {type} = node;
    if (type === 'ObjectExpression') {
      return testObjectExpression(node, defaultPropsDeclaration);
    } else if (type === 'StringLiteral'
      || type === 'NumericLiteral'
      || type === 'BooleanLiteral') {
      return testPrimitive(node);
    } else if (type === 'ArrayExpression') {
      return testArrayExpression(node);
    } else if (type === 'JSXElement') {
      return testJSXElement(node);
    }
    return null;
  }
}

function testObjectProperty(node, defaultPropsDeclaration = {}) {
  if (node) {
    const {type, key, value} = node;
    if (type === 'ObjectProperty' && key && key.type === 'Identifier' && value) {
      defaultPropsDeclaration[key.name] = testObjectPropertyValue(value);
    }
  }
  return defaultPropsDeclaration;
}

function testObjectExpression(node, defaultPropsDeclaration = {}) {
  if (node) {
    const {type, properties} = node;
    if (type === 'ObjectExpression' && properties && properties.length > 0) {
      properties.forEach(property => {
        if (property) {
          defaultPropsDeclaration = testObjectProperty(property, defaultPropsDeclaration);
        }
      });
    }
  }
  return defaultPropsDeclaration;
}

export function getDefaultPropsObject(node) {
  if (node) {
    const {type} = node;
    if (type === 'ObjectExpression') {
      return testObjectExpression(node, {});
    }
  }
  return {};
}