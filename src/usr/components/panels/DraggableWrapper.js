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

class DraggableWrapper extends React.Component {
  static propTypes = {
    resourceKey: PropTypes.string,
    resourceModel: PropTypes.object,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
  };

  static defaultProps = {
    resourceKey: null,
    resourceModel: null,
    onDragStart: () => {
      console.info('DraggableWrapperForPage.onDragStart is not set');
    },
    onDragEnd: () => {
      console.info('DraggableWrapperForPage.onDragEnd is not set');
    },
  };

  handleDragStart = (e) => {
    const { resourceKey, onDragStart } = this.props;
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.dropEffect = 'copy';
    // workaround for Firefox
    e.dataTransfer.setData("text", " ");
    onDragStart(resourceKey);
  };

  handleDragEnd = (e) => {
    const { resourceKey, resourceModel, onDragEnd} = this.props;
    onDragEnd(resourceKey, resourceModel);
  };

  render () {
    return (
      <div
        style={{width: '100%', userSelect: 'auto'}}
        draggable="true"
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
      >
        {this.props.children}
      </div>
    );
  }
}

export default DraggableWrapper;
