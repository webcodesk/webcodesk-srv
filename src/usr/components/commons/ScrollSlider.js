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

const style = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
};

class ScrollSlider extends React.Component {

  startX;
  scrollLeft;
  // startY;
  // scrollTop;

  constructor (props) {
    super(props);
    this.root = React.createRef();
    this.isDown = false;
  }

  handleMouseDown = (e) => {
    this.isDown = true;
    this.startX = e.pageX - this.root.current.offsetLeft;
    // this.startY = e.pageY - this.root.current.offsetTop;
    this.scrollLeft = this.root.current.scrollLeft;
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
      const x = e.pageX - this.root.current.offsetLeft;
      // const walkX = (x - this.startX) * 2; //scroll-fast
      const walkX = x - this.startX;
      this.root.current.scrollLeft = this.scrollLeft - walkX;
      // const y = e.pageY - this.root.current.offsetTop;
      // const walkY = (y - this.startY) * 3; //scroll-fast
      // this.root.current.scrollTop = this.scrollTop - walkY;
    }
  };

  render () {
    return (
      <div
        ref={this.root}
        style={style}
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

export default ScrollSlider;
