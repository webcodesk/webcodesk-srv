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
