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
