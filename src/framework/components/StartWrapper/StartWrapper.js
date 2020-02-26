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

import React from 'react';
import PropTypes from 'prop-types';
import createContainerActions from '../../store/actions';

const componentName = 'applicationStartWrapper';
const componentInstance = 'wrapperInstance';
const containerKey = `${componentName}_${componentInstance}`;

class StartWrapper extends React.Component {
  static propTypes = {
    actionSequences: PropTypes.object.isRequired,
    store: PropTypes.any.isRequired,
  };

  componentDidMount () {
    const { actionSequences, store } = this.props;
    let containerHandlers = [];
    let componentKey;
    const actionSequence = actionSequences[containerKey];
    if (actionSequence) {
      containerHandlers = actionSequence.events;
      componentKey = actionSequence.componentKey;
    }
    if (containerHandlers.length > 0) {
      const actions = createContainerActions(containerKey, containerHandlers);
      const onDidMountAction = actions['onApplicationStart'];
      if (onDidMountAction) {
        store.dispatch(onDidMountAction.apply(null, null));
      }
    }
  }

  render () {
    return this.props.children;
  }
}

export default StartWrapper;
