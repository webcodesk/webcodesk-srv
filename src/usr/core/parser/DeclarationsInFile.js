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

import isEqual from 'lodash/isEqual';
import constants from '../../../commons/constants';

class DeclarationsInFile {
  constructor (resourceType, declarations, filePath) {
    Object.defineProperties(this, {
      'resourceType': {
        value: resourceType,
        writable: false,
      },
      'declarations': {
        value: declarations,
        writable: false,
      },
      'filePath': {
        value: filePath,
        writable: false,
      },
      'hasDeclarations': {
        get: function () {
          return this.declarations && this.declarations.length > 0;
        }
      },
      'isInUserFunctions': {
        get: function() {
          return this.resourceType === constants.RESOURCE_IN_USER_FUNCTIONS_TYPE;
        }
      },
      'isInComponents': {
        get: function() {
          return this.resourceType === constants.RESOURCE_IN_COMPONENTS_TYPE;
        }
      },
      'isInPages': {
        get: function() {
          return this.resourceType === constants.RESOURCE_IN_PAGES_TYPE;
        }
      },
      'isInFlows': {
        get: function() {
          return this.resourceType === constants.RESOURCE_IN_FLOWS_TYPE;
        }
      },
      'isInPropTypes': {
        get: function() {
          return this.resourceType === constants.RESOURCE_IN_PROP_TYPES_TYPE;
        }
      },
      'isInMarkdown': {
        get: function() {
          return this.resourceType === constants.RESOURCE_IN_MARKDOWN_TYPE;
        }
      },
      'isInTemplates': {
        get: function() {
          return this.resourceType === constants.RESOURCE_IN_TEMPLATES_TYPE;
        }
      },
      'isInSettingsConf': {
        get: function() {
          return this.resourceType === constants.RESOURCE_IN_SETTINGS_CONF_TYPE;
        }
      },
      'isInSettings': {
        get: function() {
          return this.resourceType === constants.RESOURCE_IN_SETTINGS_TYPE;
        }
      },
      'isInState': {
        get: function() {
          return this.resourceType === constants.RESOURCE_IN_STATE_TYPE;
        }
      }
    });
  }

  isEqual = (testDeclarationsInFile) => {
    return isEqual(testDeclarationsInFile.declarations, this.declarations);
  };

  cloneWithEmptyDeclarations = () => {
    return new DeclarationsInFile(this.resourceType, [], this.filePath);
  };
}

export default DeclarationsInFile;
