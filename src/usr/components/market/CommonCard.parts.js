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
