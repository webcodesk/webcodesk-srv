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

/* eslint-disable no-new-func */
import isFunction from 'lodash/isFunction';
import isNull from 'lodash/isNull';
import PropTypes from '../../core/propTypes';
import * as constants from '../../../commons/constants';
import { format } from '../../core/utils/textUtils';

const propertyTypeMap = {
  [constants.COMPONENT_PROPERTY_STRING_TYPE]: (propertyNode) => {
    const { props: {propertyName, isRequired} } = propertyNode;
    return {
      typeInComment: `// type: string, required: ${!!isRequired}`,
      sampleCode: `${propertyName}: "text"`,
      singleSampleCode: '"text"',
      propTypesObject: PropTypes.string,
    };
  },
  [constants.COMPONENT_PROPERTY_OBJECT_TYPE]: (propertyNode) => {
    const { props: {propertyName ,isRequired} } = propertyNode;
    return {
      typeInComment: `// type: object, required: ${!!isRequired}`,
      sampleCode: `${propertyName}: {}`,
      singleSampleCode: '{}',
      propTypesObject: PropTypes.object,
    };
  },
  [constants.COMPONENT_PROPERTY_ONE_OF_TYPE]: (propertyNode) => {
    const { props: {propertyName, propertyValueVariants, isRequired} } = propertyNode;
    let variantValue;
    let variantsString = '';
    let variantsPropTypesArray = [];
    if (propertyValueVariants && propertyValueVariants.length > 0) {
      variantValue = propertyValueVariants[0].value;
      propertyValueVariants.forEach(propertyValueVariantItem => {
        variantsString += `${propertyValueVariantItem.value}, `;
        variantsPropTypesArray.push(propertyValueVariantItem.value);
      });
      if (variantsString.length > 4) {
        variantsString = variantsString.substring(0, variantsString.length - 2);
      }
    } else {
      variantsString = '"text"';
    }
    return {
      typeInComment: `// one of: ${variantsString}, required: ${!!isRequired}`,
      sampleCode: `${propertyName}: "${variantValue}"`,
      singleSampleCode: `"${variantValue}"`,
      propTypesObject: PropTypes.oneOf(variantsPropTypesArray),
    };
  },
  [constants.COMPONENT_PROPERTY_SYMBOL_TYPE]: (propertyNode) => {
    const { props: {propertyName, isRequired} } = propertyNode;
    return {
      typeInComment: `// type: string, required: ${!!isRequired}`,
      sampleCode: `${propertyName}: "text"`,
      singleSampleCode: '"text"',
      propTypesObject: PropTypes.symbol,
    };
  },
  [constants.COMPONENT_PROPERTY_BOOL_TYPE]: (propertyNode) => {
    const { props: {propertyName, isRequired} } = propertyNode;
    return {
      typeInComment: `// type: boolean, required: ${!!isRequired}`,
      sampleCode: `${propertyName}: true`,
      singleSampleCode: 'true',
      propTypesObject: PropTypes.bool,
    };
  },
  [constants.COMPONENT_PROPERTY_ANY_TYPE]: (propertyNode) => {
    const { props: {propertyName, isRequired} } = propertyNode;
    return {
      typeInComment: `// type: any, required: ${!!isRequired}`,
      sampleCode: `${propertyName}: {}`,
      singleSampleCode: '{}',
      propTypesObject: PropTypes.any,
    };
  },
  [constants.COMPONENT_PROPERTY_ARRAY_TYPE]: (propertyNode) => {
    const { props: {propertyName, isRequired} } = propertyNode;
    return {
      typeInComment: `// type: array, required: ${!!isRequired}`,
      sampleCode: `${propertyName}: []`,
      singleSampleCode: '[]',
      propTypesObject: PropTypes.array,
    };
  },
  [constants.COMPONENT_PROPERTY_NUMBER_TYPE]: (propertyNode) => {
    const { props: {propertyName, isRequired} } = propertyNode;
    return {
      typeInComment: `// type: number, required: ${!!isRequired}`,
      sampleCode: `${propertyName}: 25`,
      singleSampleCode: '25',
      propTypesObject: PropTypes.number,
    };
  },
};

class FlowInputTransformManager {

  _outputPropertiesModel;
  _inputPropertiesModel;

  _testDataScript;
  _transformScript;

  constructor () {
  }

  getOutputPropertiesModel () {
    return this._outputPropertiesModel;
  }

  setOutputPropertiesModel (value) {
    this._outputPropertiesModel = value;
  }

  getInputPropertiesModel () {
    return this._inputPropertiesModel;
  }

  setInputPropertiesModel (value) {
    this._inputPropertiesModel = value;
  }

  getTestDataScript () {
    return this._testDataScript;
  }

  getDefaultTestDataScript() {
    return this._testDataScript || format(`return function () { ${this.getOutputSampleObjectText()} return data; }`);
  }

  setTestDataScript (value) {
    this._testDataScript = value;
  }

  getTransformScript () {
    return this._transformScript;
  }

  getDefaultTransformScript () {
    return this._transformScript || 'return function (data) { return data; }';
  }

  setTransformScript (value) {
    this._transformScript = value;
  }

  getInputSampleObjectText () {
    if (this._inputPropertiesModel) {
      const dataObjectCode = this.createNextLine(this._inputPropertiesModel).join('\n');
      return dataObjectCode && dataObjectCode.length > 0
        ? format(dataObjectCode)
        : 'const data = null;';
    }
    return '';
  }

  getOutputSampleObjectText () {
    if (this._outputPropertiesModel) {
      const dataObjectCode = this.createNextLine(this._outputPropertiesModel).join('\n');
      return dataObjectCode && dataObjectCode.length > 0
        ? format(dataObjectCode)
        : 'const data = null;';
    }
    return '';
  }

  getInputSamplePropTypes () {
    if (this._inputPropertiesModel) {
      console.info('getInputSamplePropTypes: ', this._inputPropertiesModel);
      return this.createPropTypes(this._inputPropertiesModel);
    }
    return null;
  }

  createNextLine = (node, level = 0) => {
    let result = [];
    if (node) {
      const { type, props, children } = node;
      let propertyName;
      let propertyComment;
      let isRequired;
      if (props) {
        propertyName = props.propertyName;
        propertyComment = props.propertyComment;
        isRequired = props.isRequired;
      }
      if (propertyComment) {
        result.push(`/* ${propertyComment} */`);
      }
      if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
        if (propertyName) {
          if (level > 0) {
            result.push(
              `${propertyName}: {`
            );
          } else {
            result.push(`// type: object, required: ${!!isRequired}`);
            result.push('const data = {');
          }
          if (children && children.length > 0) {
            result = children.reduce(
              (acc, child) => acc.concat(this.createNextLine(child, level + 1)),
              result
            );
          }
          result.push(
            `}${level > 0 ? ',' : ';'}`
          );
        } else {
          if (level > 0) {
            result.push(
              '{'
            );
          } else {
            result.push(`// type: object, required: ${!!isRequired}`);
            result.push('const data = {');
          }
          if (children && children.length > 0) {
            result = children.reduce(
              (acc, child) => acc.concat(this.createNextLine(child, level + 1)),
              result
            );
          }
          result.push(
            `}${level > 0 ? ',' : ';'}`
          );
        }
      } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
        if (propertyName) {
          if (level > 0) {
            result.push(
              `${propertyName}: [`
            );
          } else {
            result.push(`// type: array, required: ${!isRequired}`);
            result.push('const data = [');
          }
          if (children && children.length > 0) {
            result = children.reduce(
              (acc, child) => acc.concat(this.createNextLine(child, level + 1)),
              result
            );
          }
          result.push(
            `]${level > 0 ? ',' : ';'}`
          );
        } else {
          if (level > 0) {
            result.push(
              '['
            );
          } else {
            result.push(`// type: array, required: ${!!isRequired}`);
            result.push('const data = [');
          }
          if (children && children.length > 0) {
            result = children.reduce(
              (acc, child) => acc.concat(this.createNextLine(child, level + 1)),
              result
            );
          }
          result.push(
            `]${level > 0 ? ',' : ';'}`
          );
        }
      } else if (type === constants.COMPONENT_PROPERTY_FUNCTION_TYPE) {
        if (level > 0) {
          if (children && children.length > 0) {
            result.push(
              '{'
            );
            result = children.reduce(
              (acc, child) => acc.concat(this.createNextLine(child, level + 1)),
              result
            );
            result.push(
              `}${level > 0 ? ',' : ';'}`
            );
          } else {
            result.push(
              `null${level > 0 ? ',' : ';'}`
            );
          }
        } else {
          if (children && children.length > 0) {
            result.push(`// type: object, required: ${!!isRequired}`);
            result.push('const data = {');
            result = children.reduce(
              (acc, child) => acc.concat(this.createNextLine(child, level + 1)),
              result
            );
            result.push(
              `}${level > 0 ? ',' : ';'}`
            );
          } else {
            result.push('// type: any');
            result.push('const data = null;');
          }
        }
      } else if (type === constants.COMPONENT_PROPERTY_STRING_TYPE
        || type === constants.COMPONENT_PROPERTY_OBJECT_TYPE
        || type === constants.COMPONENT_PROPERTY_ONE_OF_TYPE
        || type === constants.COMPONENT_PROPERTY_SYMBOL_TYPE
        || type === constants.COMPONENT_PROPERTY_BOOL_TYPE
        || type === constants.COMPONENT_PROPERTY_ANY_TYPE
        || type === constants.COMPONENT_PROPERTY_ARRAY_TYPE
        || type === constants.COMPONENT_PROPERTY_NUMBER_TYPE) {
        const commentValues = propertyTypeMap[type](node);
        result.push(`${commentValues.typeInComment}`);
        if (propertyName) {
          if (level > 0) {
            result.push(
              `${commentValues.sampleCode},`
            );
          } else {
            result.push(`const data = ${commentValues.singleSampleCode};`);
          }
        }
      }
    }
    return result;
  };

  createPropTypes = (node) => {
    let result = null;
    if (node) {
      const { type, props: { isRequired }, children } = node;
      if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
        let shapeObject = null;
        if (children && children.length > 0) {
          shapeObject = {};
          children.forEach(childNode => {
            const { props: {propertyName: childPropertyName} } = childNode;
            if (childPropertyName) {
              shapeObject[childPropertyName] = this.createPropTypes(childNode);
            }
          });
        }
        if (shapeObject) {
          if (isRequired) {
            result = PropTypes.shape(shapeObject).isRequired;
          } else {
            result = PropTypes.shape(shapeObject);
          }
        } else {
          if (isRequired) {
            result = PropTypes.object.isRequired;
          } else {
            result = PropTypes.object;
          }
        }
      } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
        let arrayOfObject = null;
        if (children && children.length > 0) {
          children.forEach(childNode => {
              arrayOfObject = this.createPropTypes(childNode);
          });
        }
        if (arrayOfObject) {
          if (isRequired) {
            result = PropTypes.arrayOf(arrayOfObject).isRequired;
          } else {
            result = PropTypes.arrayOf(arrayOfObject);
          }
        } else {
          if (isRequired) {
            result = PropTypes.array.isRequired;
          } else {
            result = PropTypes.array;
          }
        }
      } else if (type === constants.COMPONENT_PROPERTY_STRING_TYPE
        || type === constants.COMPONENT_PROPERTY_OBJECT_TYPE
        || type === constants.COMPONENT_PROPERTY_ONE_OF_TYPE
        || type === constants.COMPONENT_PROPERTY_SYMBOL_TYPE
        || type === constants.COMPONENT_PROPERTY_BOOL_TYPE
        || type === constants.COMPONENT_PROPERTY_ANY_TYPE
        || type === constants.COMPONENT_PROPERTY_ARRAY_TYPE
        || type === constants.COMPONENT_PROPERTY_NUMBER_TYPE) {
        const propertyTypeObject = propertyTypeMap[type](node);
        if (propertyTypeObject) {
          if (isRequired) {
            result = propertyTypeObject.propTypesObject.isRequired;
          } else {
            result = propertyTypeObject.propTypesObject;
          }
        }
      }
    }
    return result;
  };

  testTransformScript (testDataScript, transformScript) {
    let errors = [];
    let output = [];
    let testFunc;
    let transformFunc;
    try {
      testFunc = new Function(testDataScript)();
      if (!isFunction(testFunc)) {
        throw Error('The test script must return a JavaScript function.');
      }
    } catch (e) {
      errors.push('Error during the test script initialization:');
      errors.push(e.message);
      console.error(`Error during the test function initialization: ${e.message}`);
    }
    try {
      transformFunc = new Function('data', transformScript)();
      if (!isFunction(testFunc)) {
        throw Error('The transformation script must return a JavaScript function.');
      }
    } catch (e) {
      errors.push('Error during the transformation script initialization:');
      errors.push(e.message);
      console.error(`Error during the transformation function initialization: ${e.message}`);
    }

    let testDataObject;
    if (errors.length === 0) {
      try {
        testDataObject = testFunc();
        if (!testDataObject && !isNull(testDataObject)) {
          throw Error('The function should return a data object or null.')
        }
      } catch (e) {
        errors.push('Error during the test script execution:');
        errors.push(e.message);
        console.error(`Error during the test function execution: ${e.message}`);
      }
    }

    if (errors.length === 0) {
      try {
        const transformedDataObject = transformFunc(testDataObject);
        if (!transformedDataObject && !isNull(transformedDataObject)) {
          throw Error('The function should return a data object or null.')
        }

        const samplePropTypes = this.getInputSamplePropTypes();
        console.info('samplePropTypes: ', samplePropTypes);
        console.info('transformedDataObject: ', transformedDataObject);
        if (samplePropTypes) {
          const checkingPropTypes = {data: samplePropTypes};
          const checkingPropValue = {data: transformedDataObject};
          let propTypesErrors =
            PropTypes.checkPropTypes(checkingPropTypes, checkingPropValue, 'variable', 'Transformation script');
          errors = errors.concat(propTypesErrors);
        }

        output.push(JSON.stringify(transformedDataObject, null, 2));
        this._transformScript = format(transformScript);
        this._testDataScript = format(testDataScript);
      } catch (e) {
        errors.push('Error during the transformation script execution:');
        errors.push(e.message);
        console.error(`Error during the transformation script execution: ${e.message}`);
      }
    }

    if (errors.length > 0) {
      errors.push('Usage: ');
      errors.push('1. The test script should return function: return function () { ... }');
      errors.push('2. The function in test script should return a data that ' +
        'matches the structure and data type of the output endpoint or null.');
      errors.push('3. The transformation script should return function: return function (data) { ... }');
      errors.push('4. The function in transformation script should return data that ' +
        'matches the structure and data type of the input endpoint');
    }

    return {errors, output};

  }

}

export default FlowInputTransformManager;