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

import omit from 'lodash/omit';
import lowerFirst from 'lodash/lowerFirst';
import cloneDeep from 'lodash/cloneDeep';
import constants from '../../../commons/constants';
import { readFile } from '../utils/fileUtils';
import { makeResourceModelCanonicalKey } from '../utils/resourceUtils';
import {
  generateComponentMarkDownSpecification,
  generateFunctionsMarkDownSpecification
} from './generator/propTypesGenerator';

const possibleResourceTypes = [
  constants.RESOURCE_IN_COMPONENTS_TYPE,
  constants.RESOURCE_IN_FLOWS_TYPE,
  constants.RESOURCE_IN_PAGES_TYPE,
  constants.RESOURCE_IN_USER_FUNCTIONS_TYPE,
  constants.RESOURCE_IN_PROP_TYPES_TYPE,
  constants.RESOURCE_IN_MARKDOWN_TYPE,
  constants.RESOURCE_IN_CLIPBOARD_TYPE,
  constants.RESOURCE_IN_TEMPLATES_TYPE,
  constants.RESOURCE_IN_SETTINGS_CONF_TYPE,
  constants.RESOURCE_IN_SETTINGS_TYPE,
  constants.RESOURCE_IN_STATE_TYPE,
];

class ResourceAdapter {

  constructor (build) {
    this.findResourceObject = this.findResourceObject.bind(this);
    this.loadSourceCode = this.loadSourceCode.bind(this);
    if (arguments.length === 1 && this.validateBuild(build)) {
      this.getGraphByType = build.getGraphByType;
      this.specificResourceType = build.specificResourceType;
      this.resourceKey = build.resourceKey;

      // let resourceObject = build.resourceObject;
      const findResourceObject = this.findResourceObject;
      const loadSourceCode = this.loadSourceCode;
      Object.defineProperties(this, {
        // 'resourceObject': {
        //   value: resourceObject,
        //   writable: false,
        // },
        'isInUserFunctions': {
          get: function () {
            return this.resource && this.resource.resourceType === constants.RESOURCE_IN_USER_FUNCTIONS_TYPE;
          }
        },
        'isInPropTypes': {
          get: function () {
            return this.resource && this.resource.resourceType === constants.RESOURCE_IN_PROP_TYPES_TYPE;
          }
        },
        'isInComponents': {
          get: function () {
            return this.resource && this.resource.resourceType === constants.RESOURCE_IN_COMPONENTS_TYPE;
          }
        },
        'isInPages': {
          get: function () {
            return this.resource && this.resource.resourceType === constants.RESOURCE_IN_PAGES_TYPE;
          }
        },
        'isInTemplates': {
          get: function () {
            return this.resource && this.resource.resourceType === constants.RESOURCE_IN_TEMPLATES_TYPE;
          }
        },
        'isInFlows': {
          get: function () {
            return this.resource && this.resource.resourceType === constants.RESOURCE_IN_FLOWS_TYPE;
          }
        },
        'inUserFunctions': {
          get: function () {
            return this.resource && this.resource.resourceType === constants.RESOURCE_IN_USER_FUNCTIONS_TYPE;
          }
        },
        'inPropTypes': {
          get: function () {
            return this.resource && this.resource.resourceType === constants.RESOURCE_IN_PROP_TYPES_TYPE;
          }
        },
        'inMarkdown': {
          get: function () {
            return this.resource && this.resource.resourceType === constants.RESOURCE_IN_MARKDOWN_TYPE;
          }
        },
        'inClipboard': {
          get: function () {
            return this.resource && this.resource.resourceType === constants.RESOURCE_IN_CLIPBOARD_TYPE;
          }
        },
        'inSettingsConf': {
          get: function () {
            return this.resource && this.resource.resourceType === constants.RESOURCE_IN_SETTINGS_CONF_TYPE;
          }
        },
        'inSettings': {
          get: function () {
            return this.resource && this.resource.resourceType === constants.RESOURCE_IN_SETTINGS_TYPE;
          }
        },
        'resource': {
          get: function () {
            if(!this.resourceObject) {
              this.resourceObject = findResourceObject();
            }
            return this.resourceObject;
          }
        },
        'isEmpty': {
          get: function () {
            return this.resource === null;
          }
        },
        'model': {
          get: function () {
            if (this.resource) {
              return this.resource.model;
            }
            return null;
          }
        },
        'compactModel': {
          get: function () {
            if (this.model) {
              const { key, type, props } = this.model;
              return {
                key,
                type,
                props: omit(props, ['componentsTree', 'flowTree'])
              };
            }
            return null;
          }
        },
        'key': {
          get: function () {
            if (this.model) {
              return this.model.key;
            }
            return undefined;
          }
        },
        'type': {
          get: function () {
            if (this.model) {
              return this.model.type;
            }
            return undefined;
          }
        },
        'props': {
          get: function () {
            if (this.model) {
              return this.model.props;
            }
            return undefined;
          }
        },
        'absolutePath': {
          get: function () {
            if (this.props) {
              return this.props.absolutePath;
            }
            return undefined;
          }
        },
        'pageName': {
          get: function () {
            if (this.props) {
              return this.props.pageName;
            }
            return undefined;
          }
        },
        'templateName': {
          get: function () {
            if (this.props) {
              return this.props.templateName;
            }
            return undefined;
          }
        },
        'resourceType': {
          get: function () {
            if (this.resource) {
              return this.resource.resourceType;
            }
            // if (this.props) {
            //   return this.props.resourceType;
            // }
            return undefined;
          }
        },
        'instance': {
          get: function () {
            if (this.model) {
              return this.model.instance;
            }
            return undefined;
          }
        },
        'title': {
          get: function () {
            if (this.props) {
              return this.props.displayName;
            }
            return undefined;
          }
        },
        'name': {
          get: function () {
            if (this.props) {
              return this.props.name;
            }
            return undefined;
          }
        },
        'componentName': {
          get: function () {
            if (this.props) {
              return this.props.componentName;
            }
            return undefined;
          }
        },
        'componentInstance': {
          get: function () {
            if (this.isComponent) {
              // then return possible default instance name as per the component name
              // and dont keep it
              return lowerFirst(this.displayName);
            } else if (this.isComponentInstance || this.isFlowComponentInstance) {
              if (this.props) {
                return this.props.componentInstance;
              }
            }
            return undefined;
          },
        },
        'functionName': {
          get: function () {
            if (this.props) {
              return this.props.functionName;
            }
            return undefined;
          }
        },
        'functionsName': {
          get: function () {
            if (this.props) {
              return this.props.functionsName;
            }
            return undefined;
          }
        },
        'componentViewModel': {
          get: function () {
            if (this.isComponent) {
              return {
                type: constants.PAGE_COMPONENT_TYPE,
                props: {
                  componentName: this.componentName,
                  componentInstance: this.componentInstance,
                },
                children: cloneDeep(this.properties),
              }
            }
            return undefined;
          }
        },
        'componentsTree': {
          get: function () {
            if (this.props) {
              return this.props.componentsTree;
            }
            return undefined;
          }
        },
        'flowTree': {
          get: function () {
            if (this.props) {
              return this.props.flowTree;
            }
            return undefined;
          }
        },
        'isDisabled': {
          get: function () {
            if (this.props) {
              return this.props.isDisabled;
            }
            return undefined;
          }
        },
        'isTest': {
          get: function () {
            if (this.props) {
              return this.props.isTest;
            }
            return undefined;
          }
        },
        'pagePath': {
          get: function () {
            if (this.props) {
              return this.props.pagePath;
            }
            return undefined;
          }
        },
        'readmeText': {
          get: function () {
            if (!this.markdownResourceObject) {
              if (this.isComponent) {
                if (!this.markdownResourceObject) {
                  const readmeKey = makeResourceModelCanonicalKey(this.componentName, 'readme');
                  this.markdownResourceObject = new ResourceAdapter.Builder()
                    .byKeyInGraphs(readmeKey, this.getGraphByType)
                    .build();
                }
              } else if (this.isFunctions) {
                if (!this.markdownResourceObject) {
                  const readmeKey = makeResourceModelCanonicalKey(this.functionsName, 'readme');
                  this.markdownResourceObject = new ResourceAdapter.Builder()
                    .byKeyInGraphs(readmeKey, this.getGraphByType)
                    .build();
                }
              }
            }
            if (this.markdownResourceObject.isEmpty && !this.markdownSpecification) {
              if (this.isComponent) {
                return 'There is no documentation for the component. ' +
                  `Create a \`${this.displayName}.md\` file in the component's directory or add comments to the source code.`;
              } else if (this.isFunctions) {
                return 'There is no documentation for the functions. ' +
                  `Create a \`${this.displayName}.md\` file in the functions' directory or add comments to the source code.`;
              }
            }
            let resultMarkdownText = '';
            if (this.markdownResourceObject.markdownContent) {
              resultMarkdownText = `${this.markdownResourceObject.markdownContent}\n\n`;
            }
            if (this.markdownSpecification) {
              resultMarkdownText += this.markdownSpecification;
            }
            return resultMarkdownText;
          }
        },
        'markdownContent': {
          get: function () {
            if (this.props) {
              if (this.props.markdownContent) {
                return this.props.markdownContent;
              }
            }
            return undefined;
          }
        },
        'markdownSpecification': {
          get: function() {
            if (!this.markdownSpecificationText) {
              if (this.isComponent) {
                this.markdownSpecificationText =
                  generateComponentMarkDownSpecification(this.propertiesRef, this.componentComment);
              } else if (this.isFunctions) {
                const keys = this.childrenKeys;
                let functionResourceObject;
                const functionsModels = [];
                if (keys && keys.length > 0) {
                  keys.forEach(key => {
                    functionResourceObject = new ResourceAdapter.Builder()
                      .byKeyInGraphs(key, this.getGraphByType)
                      .build();
                    functionsModels.push(functionResourceObject.model);
                  });
                }
                this.markdownSpecificationText = generateFunctionsMarkDownSpecification(functionsModels);
              }
            }
            return this.markdownSpecificationText;
          }
        },
        'displayName': {
          get: function () {
            if (this.props) {
              return this.props.displayName;
            }
            return undefined;
          }
        },
        'componentComment': {
          get: function () {
            if (this.props) {
              return this.props.componentComment;
            }
            return undefined;
          }
        },
        // 'componentsTreeChunk': {
        //   get: function () {
        //     if (this.props) {
        //       return this.props.componentsTreeChunk;
        //     }
        //     return undefined;
        //   }
        // },
        'properties': {
          get: function () {
            if (this.props) {
              return this.props.properties || [];
            }
            return [];
          }
        },
        'propertiesRef': {
          get: function () {
            if (this.isComponent) {
              if (this.props) {
                return this.props.propertiesRef || [];
              }
            } else if (this.isComponentInstance) {
              if (!this.componentResourceObject) {
                this.componentResourceObject = new ResourceAdapter.Builder()
                  .byKeyInGraphs(this.componentName, this.getGraphByType)
                  .build();
              }
              return this.componentResourceObject.propertiesRef;
            }
            return [];
          }
        },
        'inputs': {
          get: function () {
            if (this.props) {
              return this.props.inputs || [];
            }
            return [];
          }
        },
        'outputs': {
          get: function () {
            if (this.props) {
              return this.props.outputs || [];
            }
            return [];
          }
        },
        'dispatches': {
          get: function () {
            if (this.props) {
              return this.props.dispatches || [];
            }
            return [];
          }
        },
        'functionsDescriptions': {
          get: function () {
            if (this.props) {
              return this.props.functionsDescriptions || [];
            }
            return [];
          }
        },
        'hasErrors': {
          get: function () {
            if (this.props) {
              return !!this.props.hasErrors;
            }
            return undefined;
          }
        },
        'childrenKeys': {
          get: function () {
            if (this.resource) {
              return this.resource.childrenKeys;
            }
            return undefined;
          }
        },
        'hasChildren': {
          get: function () {
            if (this.childrenKeys) {
              return this.childrenKeys.length > 0;
            }
            return undefined;
          }
        },
        'parentKey': {
          get: function () {
            if (this.resource && this.resource.parentKeys && this.resource.parentKeys.length > 0) {
              return this.resource.parentKeys[0];
            }
            return undefined;
          }
        },
        'allParentKeys': {
          get: function () {
            if (this.resource && this.resource.parentKeys) {
              return this.resource.parentKeys;
            }
            return undefined;
          }
        },
        'comments': {
          get: function () {
            if (this.props) {
              return this.props.comments;
            }
            return undefined;
          }
        },
        'sourceCode': {
          get: async function () {
            if (!this.sourceCodeText) {
              try {
                this.sourceCodeText = await loadSourceCode(this);
              } catch (e) {
                this.sourceCodeText = '';
              }
            }
            return this.sourceCodeText;
          }
        },
        'draggingModel': {
          get: function () {
            if (this.model) {
              const { key, type, props } = this.model;
              return {
                key,
                type,
                props: {
                  name: props.name,
                }
              };
            }
            return {};
          }
        },
        'itemModel': {
          get: function () {
            if (this.props) {
              return this.props.itemModel;
            }
            return undefined;
          }
        },
        'componentInstancesState': {
          get: function () {
            if (this.props) {
              return this.props.componentInstancesState;
            }
            return undefined;
          }
        },
        'isFile': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_FILE_TYPE;
          }
        },
        'isDirectory': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_DIR_TYPE;
          }
        },
        'isPage': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_PAGE_TYPE;
          }
        },
        'isTemplate': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_TEMPLATE_TYPE;
          }
        },
        'isComponent': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_COMPONENT_TYPE;
          }
        },
        'isComponentInstance': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_COMPONENT_INSTANCE_TYPE;
          }
        },
        'isFlow': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_FLOW_TYPE;
          }
        },
        'isUserFunction': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_USER_FUNCTION_TYPE;
          }
        },
        'isFunctions': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_FUNCTIONS_TYPE;
          }
        },
        'isPropTypes': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_PROP_TYPES_TYPE;
          }
        },
        'isMarkdown': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_MARKDOWN_TYPE;
          }
        },
        'isClipboardItem': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_CLIPBOARD_ITEM_TYPE;
          }
        },
        'isFlowComponentInstance': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_FLOW_COMPONENT_INSTANCE_TYPE;
          }
        },
        'isFlowUserFunction': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_FLOW_USER_FUNCTION_TYPE;
          }
        },
        'isSettings': {
          get: function () {
            return this.resource && this.type === constants.GRAPH_MODEL_SETTINGS_TYPE;
          }
        }
      });
    }
  }

  validateBuild (build) {
    return (String(build.constructor) === String(ResourceAdapter.Builder));
  }

  findResourceObject() {
    let resourceObject = null;
    let graphModel;
    let model;
    if (this.specificResourceType) {
      graphModel = this.getGraphByType(this.specificResourceType);
      if (graphModel) {
        model = graphModel.getNode(this.resourceKey);
        if (model) {
          resourceObject = {
            resourceType: this.specificResourceType,
            model: model,
            childrenKeys: graphModel.getChildrenKeys(this.resourceKey) || [],
            parentKeys: graphModel.getAllParentKeys(this.resourceKey) || [],
          };
        }
      }
    } else {
      let resourceType;
      for (let i = 0; i < possibleResourceTypes.length; i++) {
        resourceType = possibleResourceTypes[i];
        graphModel = this.getGraphByType(resourceType);
        if (graphModel) {
          model = graphModel.getNode(this.resourceKey);
          if (model) {
            resourceObject = {
              resourceType,
              model: model,
              childrenKeys: graphModel.getChildrenKeys(this.resourceKey) || [],
              parentKeys: graphModel.getAllParentKeys(this.resourceKey) || [],
            };
            break;
          }
        }
      }
    }
    return resourceObject;
  }

  loadSourceCode (resource) {
    if (resource && (resource.isComponent || resource.isFunctions) && resource.parentKey) {
      const fileResource = new ResourceAdapter.Builder()
        .byKeyInGraphs(resource.parentKey, this.getGraphByType)
        .build();
      if (fileResource && fileResource.absolutePath) {
        try {
          return readFile(fileResource.absolutePath);
        } catch (e) {
          console.error('Can not read the source code. ', e.message);
        }
      }
    }
    return Promise.resolve();
  }

  static get Builder () {
    class Builder {
      byKeyInGraphs (key, getGraphByType, specificResourceType = null) {
        if (!(getGraphByType instanceof Function)) {
          console.error('ResourceAdapter: the getGraphByType argument is not a function');
        } else {
          this.getGraphByType = getGraphByType;
          this.specificResourceType = specificResourceType;
          this.resourceKey = key;
        }
        return this;
      }
      build () {
        return new ResourceAdapter(this);
      }
    }

    return Builder;
  }
}

export default ResourceAdapter;