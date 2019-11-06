import React from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';
import ScrollPanel from './ScrollPanel';
import { offset } from './utils';

class AutoScrollPanel extends React.Component {
  static propTypes = {
    elementId: PropTypes.string,
  };

  static defaultProps = {
    elementId: undefined,
  };

  constructor (props) {
    super(props);
    this.state = {
      scrollTop: 0,
    };
  }

  componentDidMount () {
    const {elementId} = this.props;
    if (elementId) {
      this.scrollToElement(elementId);
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const {elementId} = this.props;
    if (elementId !== prevProps.elementId) {
      this.scrollToElement(elementId);
    }
  }

  scrollToElement = (elementId) => {
    if (elementId) {
      const elOffset = offset(document.getElementById(elementId));
      this.setState({
        scrollTop: (this.scrollPanel.getScrollTop() + elOffset.top) -
          (this.scrollPanel.getOffset().top) -
          (elOffset.bottom - elOffset.top),
      });
    }
  };

  render () {
    const {scrollTop} = this.state;
    return (
      <Motion style={{scrollTop: spring(scrollTop)}}>
        {interpolatingStyle => {
          return (
            <ScrollPanel ref={me => this.scrollPanel = me} scrollTop={interpolatingStyle.scrollTop}>
              {this.props.children}
            </ScrollPanel>
          )
        }}
      </Motion>
    );
  }
}

export default AutoScrollPanel;
