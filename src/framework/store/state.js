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

import forOwn from 'lodash/forOwn';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isObject';

function createArrayState (arrayModel, initialState) {
  const result = [];
  if (arrayModel.length > 0) {
    arrayModel.forEach(descriptionItem => {
      if (descriptionItem) {
        if (isArray(descriptionItem)) {
          result.push(createArrayState(descriptionItem, initialState));
        } else if (isPlainObject(descriptionItem)) {
          if (descriptionItem.type && descriptionItem.instance) {
            createComponentState(descriptionItem, initialState);
          } else {
            result.push(createShapeState(descriptionItem, initialState));
          }
        } else {
          result.push(descriptionItem);
        }
      } else {
        result.push(descriptionItem);
      }
    });
  }
  return result;
}

function createShapeState (shapeModel, initialState) {
  const result = {};
  forOwn(shapeModel, (value, prop) => {
    if (value) {
      if (isArray(value)){
        result[prop] = createArrayState(value, initialState);
      } else if (isPlainObject(value)) {
        if (value.type && value.instance) {
          createComponentState(value, initialState);
        } else {
          result[prop] = createShapeState(value, initialState);
        }
      } else {
        result[prop] = value;
      }
    } else {
      result[prop] = value;
    }
  });
  return result;
}

function createComponentState(componentModel, initialState) {
  if (componentModel) {
    const { type, instance, props } = componentModel;
    if (props) {
      const key = `${type}_${instance}`;
      initialState[key] = createShapeState(props, initialState);
    }
  }
}

export function createInitialState(pages) {
  let initialState = {};
  if (pages) {
    forOwn(pages, value => {
        createComponentState(value, initialState);
    });
  }
  return initialState;
}