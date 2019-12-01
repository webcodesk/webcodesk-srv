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
import { format } from '../../core/utils/textUtils';
import { generatePropTypesObject, generateSampleObjectScript } from '../project/generator/propTypesGenerator';

class FlowInputTransformManager {

  _outputPropertiesModel;
  _inputPropertiesModel;

  _testDataScript;
  _transformScript;

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
    return this._testDataScript ||
      format(`return function () { ${this.getOutputSampleObjectText()} return outputObject; }`);
  }

  setTestDataScript (value) {
    this._testDataScript = value;
  }

  getTransformScript () {
    return this._transformScript;
  }

  getDefaultTransformScript () {
    return this._transformScript || 'return function (outputObject) { return inputObject; }';
  }

  setTransformScript (value) {
    this._transformScript = value;
  }

  getInputSampleObjectText () {
    if (this._inputPropertiesModel) {
      const dataObjectCode = generateSampleObjectScript(this._inputPropertiesModel, 'inputObject');
      return dataObjectCode && dataObjectCode.length > 0
        ? format(dataObjectCode)
        : 'const inputObject = null;';
    }
    return '';
  }

  getOutputSampleObjectText () {
    if (this._outputPropertiesModel) {
      const dataObjectCode = generateSampleObjectScript(this._outputPropertiesModel, 'outputObject');
      return dataObjectCode && dataObjectCode.length > 0
        ? format(dataObjectCode)
        : 'const outputObject = null;';
    }
    return '';
  }

  getInputSamplePropTypes () {
    if (this._inputPropertiesModel) {
      return generatePropTypesObject(this._inputPropertiesModel);
    }
    return null;
  }

  testTransformScript (testDataScript, transformScript) {
    let errors = [];
    let output = [];
    let usage = [];
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
        if (samplePropTypes) {
          const checkingPropTypes = {inputObject: samplePropTypes};
          const checkingPropValue = {inputObject: transformedDataObject};
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
      usage.push('');
      usage.push('Usage: ');
      usage.push('1. The test script should return function: return function () { ... }');
      usage.push('2. The function in test script should return a data that ' +
        'matches the structure and data type of the output endpoint or null.');
      usage.push('3. The transformation script should return function: return function (data) { ... }');
      usage.push('4. The function in transformation script should return data that ' +
        'matches the structure and data type of the input endpoint');
    }

    return {errors, output, usage};

  }

}

export default FlowInputTransformManager;