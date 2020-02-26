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
import { offset } from './utils';

const styles = {
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
};

class ScrollPanel extends React.Component {

  startX;
  scrollLeft;

  static propTypes = {
    scrollTop: PropTypes.number,
  };

  static defaultProps = {
    scrollTop: 0,
  };

  constructor (props) {
    super(props);
    this.rootElement = React.createRef();
    this.isDown = false;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.scrollTop !== prevProps.scrollTop) {
      this.rootElement.current.scrollTop = this.props.scrollTop;
    }
  }

  getScrollTop = () => {
    return this.rootElement.current.scrollTop;
  };

  getOffset = () => {
    return offset(this.rootElement.current);
  };

  getElementOffset = (elementId) => {
    const foundElement = this.rootElement.current.querySelector(`[id='${elementId}']`);
    if (foundElement) {
      return offset(foundElement);
    }
    return null;
  };

  handleMouseDown = (e) => {
    this.isDown = true;
    this.startX = e.pageX - this.rootElement.current.offsetLeft;
    // this.startY = e.pageY - this.root.current.offsetTop;
    this.scrollLeft = this.rootElement.current.scrollLeft;
    // this.scrollTop = this.root.current.scrollTop;
  };

  handleMouseLeave = (e) => {
    this.isDown = false;
  };

  handleMouseUp = (e) => {
    this.isDown = false;
  };

  handleMouseMove = (e) => {
    if (this.isDown) {
      e.preventDefault();
      const x = e.pageX - this.rootElement.current.offsetLeft;
      // const walkX = (x - this.startX) * 2; //scroll-fast
      const walkX = x - this.startX;
      this.rootElement.current.scrollLeft = this.scrollLeft - walkX;
      // const y = e.pageY - this.root.current.offsetTop;
      // const walkY = (y - this.startY) * 3; //scroll-fast
      // this.root.current.scrollTop = this.scrollTop - walkY;
    }
  };

  render () {
    return (
      <div
        ref={this.rootElement}
        style={styles.root}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.children}
      </div>
    );
  }
}

export default ScrollPanel;
