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
