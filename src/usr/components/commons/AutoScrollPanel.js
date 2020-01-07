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
import { Motion, spring } from 'react-motion';
import ScrollPanel from './ScrollPanel';

class AutoScrollPanel extends React.Component {
  static propTypes = {
    elementId: PropTypes.string,
  };

  static defaultProps = {
    elementId: undefined,
  };

  constructor (props) {
    super(props);
    this.scrollPanel = React.createRef();
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
      const elOffset = this.scrollPanel.current.getElementOffset(elementId);
      const panelOffset = this.scrollPanel.current.getOffset();
      if (elOffset) {
        const bottomBorder = panelOffset.bottom - elOffset.bottom;
        const topBorder = panelOffset.top - elOffset.top;
        if (bottomBorder < 0 || topBorder > 0) {
          this.setState({
            scrollTop:
              (this.scrollPanel.current.getScrollTop() + elOffset.top) -
              panelOffset.top - (elOffset.bottom - elOffset.top),
          });
        }
      }
    }
  };

  render () {
    const {scrollTop} = this.state;
    return (
      <Motion style={{scrollTop: spring(scrollTop)}}>
        {interpolatingStyle => {
          return (
            <ScrollPanel ref={this.scrollPanel} scrollTop={interpolatingStyle.scrollTop}>
              {this.props.children}
            </ScrollPanel>
          )
        }}
      </Motion>
    );
  }
}

export default AutoScrollPanel;
