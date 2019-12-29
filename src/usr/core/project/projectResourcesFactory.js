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

import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';
import constants from '../../../commons/constants';
import { getParticleName } from '../utils/textUtils';
import { makeResourceModelCanonicalKey } from '../utils/resourceUtils';

export function createFunctionsModels (modelKey, declarationsInFile, displayName) {
  const result = [];
  const functionsKey = `${modelKey}_functions`;
  const functionsModel = {
    key: functionsKey,
    type: constants.GRAPH_MODEL_FUNCTIONS_TYPE,
    props: {
      resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
      displayName,
      functionsName: modelKey,
    },
    children: [],
  };
  declarationsInFile.declarations.forEach(functionDeclaration => {
    const { functionName, parameters, dispatches, wcdAnnotations, externalProperties } = functionDeclaration;
    const canonicalFunctionName = makeResourceModelCanonicalKey(modelKey, functionName);
    let sortedDispatches = [];
    if (dispatches && dispatches.length > 0) {
      sortedDispatches = dispatches.sort((a, b) => a.name.localeCompare(b.name));
    }
    sortedDispatches.push({
      name: constants.FUNCTION_OUTPUT_ERROR_NAME,
      wcdAnnotations: {
        [constants.ANNOTATION_COMMENT]:
        'A dispatch is added automatically to each function. ' +
        'The dispatch is triggered when an error is not caught in the function body. ' +
        'The output payload has the Error type.'
      }
    });
    functionsModel.children.push({
      key: canonicalFunctionName,
      type: constants.GRAPH_MODEL_USER_FUNCTION_TYPE,
      props: {
        resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
        name: functionName,
        displayName: functionName,
        functionName: canonicalFunctionName,
        functionComment: wcdAnnotations[constants.ANNOTATION_COMMENT],
        parentFunctionsKey: modelKey,
        dispatches: cloneDeep(sortedDispatches),
        parameters: cloneDeep(parameters),
        externalProperties,
      }
    });
  });
  result.push(functionsModel);
  return result;
}

export function createComponentsModels (modelKey, declarationsInFile) {
  const result = [];
  declarationsInFile.declarations.forEach(componentDeclaration => {
    const { componentName, properties, defaultProps, wcdAnnotations, externalProperties } = componentDeclaration;
    const canonicalComponentName = modelKey;
    result.push({
      key: canonicalComponentName,
      type: constants.GRAPH_MODEL_COMPONENT_TYPE,
      props: {
        resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
        name: componentName,
        displayName: componentName,
        componentName: canonicalComponentName,
        properties: cloneDeep(properties),
        defaultProps: cloneDeep(defaultProps),
        externalProperties: externalProperties,
        componentComment: wcdAnnotations[constants.ANNOTATION_COMMENT],
      }
    });
  });
  return result;
}

export function createPropTypesModels (modelKey, declarationsInFile) {
  const result = [];
  declarationsInFile.declarations.forEach(componentDeclaration => {
    const { name, properties } = componentDeclaration;
    const canonicalPropTypesName = makeResourceModelCanonicalKey(modelKey, name);
    result.push({
      key: canonicalPropTypesName,
      type: constants.GRAPH_MODEL_PROP_TYPES_TYPE,
      props: {
        resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
        name,
        displayName: name,
        properties: cloneDeep(properties),
      }
    });
  });
  return result;
}

export function createPageModels(modelKey, declarationsInFile) {
  const result = [];
  declarationsInFile.declarations.forEach(pageDeclaration => {
    const { pageName, pagePath, componentsTree, isTest, componentInstances } = pageDeclaration;
    const pageModel = {
      key: pagePath, // set page path as a key in order to find the resource from any place
      type: constants.GRAPH_MODEL_PAGE_TYPE,
      props: {
        displayName: pageName,
        pageName,
        pagePath,
        isTest,
        resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
        componentsTree: cloneDeep(componentsTree),
      },
      children: [],
    };
    let componentInstanceModel;
    if (componentInstances && componentInstances.length > 0) {
      componentInstances.forEach((componentInstanceItem, instanceIndex) => {
        const { componentName, componentInstance, componentsTree } = componentInstanceItem;
        componentInstanceModel = {
          key: `${makeResourceModelCanonicalKey(modelKey, componentInstance)}-${instanceIndex}`,
          type: constants.GRAPH_MODEL_COMPONENT_INSTANCE_TYPE,
          props: {
            resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
            name: componentInstance,
            displayName: componentInstance,
            componentName: componentName,
            componentInstance: componentInstance,
            componentsTreeChunk: cloneDeep(componentsTree),
            pageName,
            pagePath,
            isTest,
          }
        };
        pageModel.children.push(componentInstanceModel);
      });
    }
    result.push(pageModel);
  });
  return result;
}

export function createTemplateModels(modelKey, declarationsInFile) {
  const result = [];
  declarationsInFile.declarations.forEach(pageDeclaration => {
    const { templateName, componentsTree } = pageDeclaration;
    const templateModel = {
      key: makeResourceModelCanonicalKey(modelKey, templateName),
      type: constants.GRAPH_MODEL_TEMPLATE_TYPE,
      props: {
        displayName: templateName,
        templateName,
        resourceType: declarationsInFile.resourceType,
        componentsTree: cloneDeep(componentsTree),
      },
      children: [],
    };
    result.push(templateModel);
  });
  return result;
}

export function createFlowModels(modelKey, declarationsInFile) {
  const result = [];
  declarationsInFile.declarations.forEach(declaration => {
    const { flowName, model, isDisabled, isTest, flowParticles } = declaration;
    const flowModel = {
      key: modelKey,
      type: constants.GRAPH_MODEL_FLOW_TYPE,
      props: {
        resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
        flowName: flowName,
        isDisabled,
        isTest,
        displayName: flowName,
        flowTree: cloneDeep(model),
      },
      children: [],
    };
    if (flowParticles && flowParticles.length > 0) {
      let particleModel;
      let particleDisplayName;
      flowParticles.forEach((flowParticle, particleIndex) => {
        const {
          flowParticleType,
          functionName,
          componentName,
          componentInstance,
          pagePath,
          pageName,
          inputs,
          outputs,
          connectedToName,
          connectedToOutput
        } = flowParticle;
        if (flowParticleType === constants.FLOW_USER_FUNCTION_TYPE) {
          particleDisplayName = getParticleName(functionName);
          particleModel = {
            key: `${makeResourceModelCanonicalKey(modelKey, particleDisplayName)}-${particleIndex}`,
            type: constants.GRAPH_MODEL_FLOW_USER_FUNCTION_TYPE,
            props: {
              resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
              name: functionName,
              isTest,
              displayName: particleDisplayName,
              functionName: functionName,
              connectedToName,
              connectedToOutput,
              inputs: cloneDeep(inputs),
              outputs: cloneDeep(outputs),
            }
          };
          flowModel.children.push(particleModel);
        } else if (flowParticleType === constants.FLOW_COMPONENT_INSTANCE_TYPE) {
          particleModel = {
            key: `${makeResourceModelCanonicalKey(modelKey, componentInstance)}-${particleIndex}`,
            type: constants.GRAPH_MODEL_FLOW_COMPONENT_INSTANCE_TYPE,
            props: {
              resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
              name: componentInstance,
              displayName: componentInstance,
              componentName: componentName,
              componentInstance: componentInstance,
              connectedToName,
              connectedToOutput,
              isTest,
              inputs: cloneDeep(inputs),
              outputs: cloneDeep(outputs),
            }
          };
          flowModel.children.push(particleModel);
        } else if (flowParticleType === constants.FLOW_PAGE_TYPE) {
          particleModel = {
            key: `${makeResourceModelCanonicalKey(modelKey, pagePath)}-${particleIndex}`,
            type: constants.GRAPH_MODEL_FLOW_PAGE_TYPE,
            props: {
              resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
              displayName: pageName,
              pageName,
              pagePath,
              connectedToName,
              connectedToOutput,
              isTest,
              inputs: cloneDeep(inputs),
              outputs: cloneDeep(outputs),
            }
          };
          flowModel.children.push(particleModel);
        }
      });
    }
    result.push(flowModel);
  });
  return result;
}

export function createMarkdownModels (modelKey, declarationsInFile, displayName) {
  const result = [];
  declarationsInFile.declarations.forEach(markdownDeclaration => {
    const { markdownContent } = markdownDeclaration;
    const canonicalReadmeName = makeResourceModelCanonicalKey(modelKey, 'readme');
    result.push({
      key: canonicalReadmeName,
      type: constants.GRAPH_MODEL_MARKDOWN_TYPE,
      props: {
        resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
        displayName,
        markdownContent,
      }
    });
  });
  return result;
}

export function createSettingsConfigModels (modelKey, declarationsInFile) {
  const result = [];
  declarationsInFile.declarations.forEach(settingsConfigDeclaration => {
    const { properties, defaultProps } = settingsConfigDeclaration;
    result.push({
      key: modelKey,
      type: constants.GRAPH_MODEL_SETTINGS_CONF_TYPE,
      props: {
        resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
        settingsConfProperties: cloneDeep(properties),
        defaultProps: cloneDeep(defaultProps),
      }
    });
  });
  return result;
}

export function createSettingsModels (modelKey, declarationsInFile) {
  const result = [];
  declarationsInFile.declarations.forEach(settingsDeclaration => {
    const { model } = settingsDeclaration;
    result.push({
      key: modelKey,
      type: constants.GRAPH_MODEL_SETTINGS_TYPE,
      props: {
        resourceType: declarationsInFile.resourceType, // the resource type can be obtained from adapter, so we don't need keep resource type here
        settingsProperties: cloneDeep(model),
      }
    });
  });
  return result;
}

export function createClipboardModel(clipboardItemModel) {
  let newClipboardItemModel = clipboardItemModel ? cloneDeep(clipboardItemModel) : {};
  newClipboardItemModel.props = newClipboardItemModel.props || {};
  delete newClipboardItemModel.key;
  const result = {
    key: uniqueId('clipboardItem'),
    type: constants.GRAPH_MODEL_CLIPBOARD_ITEM_TYPE,
    props: {
      resourceType: constants.RESOURCE_IN_CLIPBOARD_TYPE,
      // fixme: change this when the clipboard will accept other models than component instances
      displayName: newClipboardItemModel.props.componentInstance,
      itemModel: newClipboardItemModel,
    }
  };
  return result;
}