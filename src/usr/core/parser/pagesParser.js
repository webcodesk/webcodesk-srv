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
import PageComposerManager from '../pageComposer/PageComposerManager';

// function getComponentInstances(componentsTree) {
//   let instances = [];
//   if (componentsTree) {
//     const { type, instance, children } = componentsTree;
//     if (instance && instance.length > 0) {
//       instances.push({
//         componentName: type,
//         componentInstance: instance,
//       });
//     }
//     if (children && children.length > 0) {
//       children.forEach(child => {
//         instances = instances.concat(getComponentInstances(child));
//       });
//     }
//   }
//   instances = uniqWith(instances, isEqual);
//   return instances;
// }

export function findPageDeclarations(sourceCode) {
  const declarations = [];
  try {
    const pageJSON = isString(sourceCode) ? JSON.parse(sourceCode) : sourceCode;
    const { pageName, pagePath, componentsTree, metaData, isTest } = pageJSON;
    const pageComposerManager = new PageComposerManager(componentsTree);
    const pageDeclaration = {
      pageName,
      pagePath,
      componentsTree,
      metaData,
      isTest,
      componentInstances:  pageComposerManager.getInstancesListUniq(),
    };
    declarations.push(pageDeclaration);
  } catch(e) {
    console.error('Parsing the page source code: ', e);
    // do nothing...
  }
  return declarations;
}
