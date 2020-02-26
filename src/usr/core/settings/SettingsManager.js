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