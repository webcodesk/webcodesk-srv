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

// import React from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';

export const CommonCardHeader = withStyles(theme => ({
  title: {
    fontSize: '16px',
    fontWeight: 700
  },
  subheader: {
    fontSize: '10px'
  }
}))(CardHeader);

export const CommonCardAvatar = withStyles(theme => ({
  root: {
    width: '1.5em',
    height: '1.5em',
    fontSize: '12px'
  }
}))(Avatar);

export const CommonCardContent = withStyles(theme => ({
  root: {
    flexGrow: 1,
  }
}))(CardContent);

export const CommonCardActionArea = withStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexDirection: 'column'
  }
}))(CardActionArea);

export const CommonCard = withStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  }
}))(Card);
