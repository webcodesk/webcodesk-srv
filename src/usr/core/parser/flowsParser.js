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

import isString from 'lodash/isString';

export function findFlowDeclarations (sourceCode) {
  const declarations = [];
  try {
    const pageJSON = isString(sourceCode) ? JSON.parse(sourceCode) : sourceCode;
    const { flowName, model, isDisabled, isTest } = pageJSON;
    const flowDeclaration = {
      flowName,
      isDisabled,
      isTest,
      model,
    };
    declarations.push(flowDeclaration);
  } catch (e) {
    console.error('Parsing the flow source code: ', e);
    // do nothing...
  }
  return declarations;
}
