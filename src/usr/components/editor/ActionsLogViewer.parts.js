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

import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import TableRow from '@material-ui/core/TableRow';

export const ActionsLogChip = withStyles(theme => ({
  root: {
    height: '20px',
    borderRadius: '4px',
    backgroundColor: '#f1f1f1',
    fontWeight: 'bold'
  },
  label: {
    paddingLeft: '6px',
    paddingRight: '6px',
  }
}))(Chip);

export const ActionsLogTableRow = withStyles(theme => ({
  root: {
    height: '32px',
  },
}))(TableRow);

export const ActionsLogTableRowSelected = withStyles(theme => ({
  root: {
    height: '32px',
    backgroundColor: '#E3F2FD',
  }
}))(TableRow);

export const ActionsLogTableRowHighlighted = withStyles(theme => ({
  root: {
    height: '32px',
    backgroundColor: '#fff59d',
  },
}))(TableRow);

export const ActionsLogCellButton = withStyles(theme => ({
  sizeSmall: {
    padding: '2px 8px',
    borderRadius: '16px',
    textTransform: 'none',
    fontWeight: 'normal',
    minHeight: '24px',
    marginLeft: '6px',
    whiteSpace: 'nowrap'
  }
}))(Button);
