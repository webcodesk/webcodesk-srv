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
