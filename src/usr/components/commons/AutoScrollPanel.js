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
