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
