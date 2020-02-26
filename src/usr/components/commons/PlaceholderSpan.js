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
  border: '1px dashed #7d7d7d',
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
  border: '1px dashed #7d7d7d',
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
      <div
        style={style}
      >
        <div
          onDragOver={this.handleItemDragOver}
          onDragEnter={this.handleItemDragEnter}
          onDragLeave={this.handleItemDragLeave}
          onDrop={this.handleItemDrop}
          style={dropStyle}
        />
        {this.props.children}
      </div>
    );
  }
}

export default PlaceholderSpan;
