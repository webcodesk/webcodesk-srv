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
