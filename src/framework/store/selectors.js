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

import { createSelector } from 'reselect';

const select = (componentName, componentInstance, propertyName) => (state, props) => {
  const instanceState = state[`${componentName}_${componentInstance}`];
  if (instanceState) {
    if (props) {
      if (typeof instanceState[propertyName] !== 'undefined') {
        return instanceState[propertyName];
      }
      return props.wrappedProps[propertyName];
    } else {
      return instanceState[propertyName]
    }
  } else if (props) {
    return props.wrappedProps[propertyName];
  }
  return undefined;
};

export const createContainerSelector = (componentName, componentInstance, propertyName) => {
  return createSelector(
    select(componentName, componentInstance, propertyName),
    a => a
  );
};

export default createContainerSelector;
