import React from 'react';
import PropTypes from 'prop-types';
import { offset } from './utils';

const styles = {
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    overflow: 'auto',
  },
};

class ScrollPanel extends React.Component {
  static propTypes = {
    scrollTop: PropTypes.number,
  };

  static defaultProps = {
    scrollTop: 0,
  };

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.scrollTop !== prevProps.scrollTop) {
      this.rootElement.scrollTop = this.props.scrollTop;
    }
  }

  getScrollTop = () => {
    return this.rootElement.scrollTop;
  };

  getOffset = () => {
    return offset(this.rootElement);
  };

  render () {
    return (
      <div ref={me => this.rootElement = me} style={styles.root}>
        {this.props.children}
      </div>
    );
  }
}

export default ScrollPanel;
