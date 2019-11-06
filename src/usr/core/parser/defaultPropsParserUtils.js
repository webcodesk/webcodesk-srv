
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