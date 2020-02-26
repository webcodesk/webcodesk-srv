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
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const ToolbarPanel = (props) => {
  return (
    <div className={props.classes.root}>
      {props.children}
    </div>
  )
};

export const MarketBoardToolbarPanel = withStyles(theme => ({
  root: {
    display: 'flex',
    height: '39px',
    flexDirection: 'column',
    width: '100%',
    borderBottom: '1px solid #dddddd'
  }
}))(ToolbarPanel);

export const MarketBoardToolbar = withStyles(theme => ({
  root: {
    minHeight: '38px',
    height: '38px',
    flexWrap: 'nowrap',
  }
}))(Toolbar);

export const PreTypography = withStyles(theme => ({
  body1: {
    whiteSpace: 'pre-wrap'
  },
  body2: {
    whiteSpace: 'pre-wrap'
  }
}))(Typography);
