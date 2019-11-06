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

const style = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
};

const styleDropZoneAcceptable = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '4px',
  border: '1px dashed #FFC107',
  zIndex: 5,
};

const styleDropZoneAccepting = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '4px',
  backgroundColor: '#76FF03',
  zIndex: 5,
  opacity: 0.3,
};

const styleDropZone = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '4px',
  border: '1px dashed #dddddd',
  zIndex: 5,
};

class PlaceholderSpan extends React.Component {
  static propTypes = {
    node: PropTypes.object,
    draggedItem: PropTypes.object,
    isDraggingItem: PropTypes.bool,
    onDrop: PropTypes.func,
  };

  static defaultProps = {
    node: {},
    draggedItem: {},
    isDraggingItem: false,
    onDrop: () => {
      console.info('PlaceholderSpan.onDrop is not set');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      isAcceptable: false,
      isAccepting: false,
    };
  }

  handleItemDragOver = (e) => {
    if (this.state.isAccepting) {
      e.preventDefault();
    }
  };

  handleItemDragEnter = (e) => {
    const {draggedItem, isDraggingItem} = this.props;
    if (draggedItem && isDraggingItem) {
      this.setState({
        isAccepting: true,
      });
    }
  };

  handleItemDragLeave = (e) => {
    this.setState({
      isAccepting: false,
    });
  };

  handleItemDrop = (e) => {
    const {draggedItem, isDraggingItem, onDrop} = this.props;
    const {isAccepting} = this.state;
    if (isAccepting && draggedItem && isDraggingItem) {
      onDrop(draggedItem);
      this.setState({
        isAccepting: false,
      });
    }
  };

  render () {
    const { isDraggingItem } = this.props;
    const {isAccepting} = this.state;
    let dropStyle = styleDropZone;
    if (isAccepting) {
      dropStyle = styleDropZoneAccepting;
    } else if (isDraggingItem) {
      dropStyle = styleDropZoneAcceptable;
    }
    return (
      <span
        style={style}
      >
        <span
          onDragOver={this.handleItemDragOver}
          onDragEnter={this.handleItemDragEnter}
          onDragLeave={this.handleItemDragLeave}
          onDrop={this.handleItemDrop}
          style={dropStyle}
        />
        {this.props.children}
      </span>
    );
  }
}

export default PlaceholderSpan;
