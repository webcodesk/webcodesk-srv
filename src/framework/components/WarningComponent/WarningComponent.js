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
import { Link } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

class WarningComponent extends React.Component {

  render () {
    const { message, linkTo, linkLabel } = this.props;
    return (
      <div style={style}>
        <div><code>{message}</code></div>
        {linkTo && <div>&nbsp;&nbsp;<Link to={linkTo}>{linkLabel}</Link></div>}
      </div>
    );
  }
}

export default WarningComponent;
