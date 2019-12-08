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
      format(`() => {\n  ${this.getOutputSampleObjectText()}\n  return outputObject;\n}`);
  }

  setTestDataScript (value) {
    this._testDataScript = value;
  }

  getTransformScript () {
    return this._transformScript;
  }

  getDefaultTransformScript () {
    return this._transformScript || '(outputObject) => {\n  return inputObject;\n}';
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
    if (!testDataScript) {
      errors.push('The test script is empty.');
    }
    if (!transformScript) {
      errors.push('The transformation script is empty.');
    }
    if (errors.length === 0) {
      try {
        testFunc = new Function(`return ${testDataScript}`)();
        if (!isFunction(testFunc)) {
          throw Error('The test script must be a JavaScript function.');
        }
      } catch (e) {
        errors.push('Error during the test script initialization:');
        errors.push(e.message);
        console.error(`Error during the test function initialization: ${e.message}`);
      }
    }
    if (errors.length === 0) {
      try {
        transformFunc = new Function('data', `return ${transformScript}`)();
        if (!isFunction(testFunc)) {
          throw Error('The transformation script must be a JavaScript function.');
        }
      } catch (e) {
        errors.push('Error during the transformation script initialization:');
        errors.push(e.message);
        console.error(`Error during the transformation function initialization: ${e.message}`);
      }
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
        if (typeof transformedDataObject === 'undefined') {
          // the return type can be undefined in case we want to stop transferring data to the input
          output.push('undefined // the transferring data will be skipped and the input endpoint will not receive new data.');
        } else {
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
        }
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
      usage.push('1. The function in test script should return a data that ' +
        'matches the structure and data type of the output endpoint or null.');
      usage.push('2. The function in transformation script should return data that ' +
        'matches the structure and data type of the input endpoint');
      usage.push('3. The function in transformation script can return undefined ' +
        'in case we want to stop transferring data to the input endpoint.');
    }

    return {errors, output, usage};

  }

}

export default FlowInputTransformManager;