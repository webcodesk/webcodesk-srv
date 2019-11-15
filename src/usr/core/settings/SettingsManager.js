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
import GraphModel from '../graph/GraphModel';

class SettingsManager {

  constructor (settingsProperties) {
    this.graphModel = new GraphModel({globallyUniqueKeys: false});
    this.graphModel.initModel({children: cloneDeep(settingsProperties)});
  }

  getModel () {
    return this.graphModel.getModel();
  }

  getSettingsProperties () {
    const model = this.graphModel.getModel();
    if (model) {
      return model.children;
    }
    return [];
  }

  updateProperty = (newPropertyModel) => {
    if (newPropertyModel) {
      const { key } = newPropertyModel;
      const prevModel = this.graphModel.getNode(key);
      if (prevModel) {
        return this.graphModel.updateNode(key, newPropertyModel);
      }
    }
  };

  deleteProperty = (targetKey) => {
    this.graphModel.deleteNode(targetKey);
  };

  increasePropertyArray = (targetKey) => {
    const nodeModel = this.graphModel.getNode(targetKey);
    if (nodeModel) {
      const { props } = nodeModel;
      if (props) {
        const {defaultChildren} = props;
        if (defaultChildren && defaultChildren.length > 0) {
          defaultChildren.forEach(childModel => {
            this.graphModel.addChildNode(targetKey, childModel);
          });
        }
      }
    }
  };

}

export default SettingsManager;