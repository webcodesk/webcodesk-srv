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
import stylePropType from 'react-style-proptype';

export const RESIZER_DEFAULT_CLASSNAME = 'Resizer';

class Resizer extends React.Component {
  render() {
    const {
      className,
      onClick,
      onDoubleClick,
      onMouseDown,
      onTouchEnd,
      onTouchStart,
      resizerClassName,
      split,
      style,
    } = this.props;
    const classes = [resizerClassName, split, className];

    return (
      <span
        role="presentation"
        className={classes.join(' ')}
        style={style}
        onMouseDown={event => onMouseDown(event)}
        onTouchStart={event => {
          event.preventDefault();
          onTouchStart(event);
        }}
        onTouchEnd={event => {
          event.preventDefault();
          onTouchEnd(event);
        }}
        onClick={event => {
          if (onClick) {
            event.preventDefault();
            onClick(event);
          }
        }}
        onDoubleClick={event => {
          if (onDoubleClick) {
            event.preventDefault();
            onDoubleClick(event);
          }
        }}
      />
    );
  }
}

Resizer.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseDown: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  onTouchEnd: PropTypes.func.isRequired,
  split: PropTypes.oneOf(['vertical', 'horizontal']),
  style: stylePropType,
  resizerClassName: PropTypes.string.isRequired,
};

Resizer.defaultProps = {
  resizerClassName: RESIZER_DEFAULT_CLASSNAME,
};

export default Resizer;
