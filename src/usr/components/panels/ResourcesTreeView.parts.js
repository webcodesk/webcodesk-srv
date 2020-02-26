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
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

export const ResourceList = withStyles(theme => ({
  root: {
    width: '100%',
    // borderBottom: '1px solid #dddddd',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
}))(List);

export const ResourceListItem = withStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%',
    // boxSizing: 'inherit',
    cursor: 'default',
    // '&:hover': {
      // backgroundColor: '#f7f7f7',
      // outline: '1px solid #f5f5f5'
    // },
    userSelect: 'none',
  },
  dense: {
    paddingTop: 0,
    paddingBottom: 0,
    // paddingLeft: '16px'
  },
  // todo: it does not work for selected item... try new version of MUI
  // selected: {
  //   // backgroundColor: 'rgba(0, 0, 0, 0.09)',
  //   backgroundColor: 'red',
  //   '&:hover': {
  //     backgroundColor: 'red',
  //   },
  // }
}))(ListItem);

export const ResourceListItemText = withStyles({
  root: {
    padding: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
  },
  primary: {
    whiteSpace: 'nowrap'
  }
})(ListItemText);

export const ResourceListItemDimmedText = withStyles({
  root: {
    padding: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    color: '#607d8b',
  },
  primary: {
    color: '#607d8b',
    whiteSpace: 'nowrap',
  }
})(ListItemText);

export const ResourceListItemErrorText = withStyles({
  root: {
    padding: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
  },
  primary: {
    color: '#D50000',
    whiteSpace: 'nowrap'
  }
})(ListItemText);

export const ResourceListItemIcon = withStyles({
  root: {
    marginRight: 0,
    padding: 0,
    width: '18px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontSize: '14px'
  }
})(ListItemIcon);

export const ResourceListItemExpandedIcon = withStyles({
  root: {
    marginRight: 0,
    padding: 0,
    width: '18px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
})(ListItemIcon);

export const ResourceListItemButton = withStyles({
  root: {
    padding: 0,
    fontSize: '1em',
  }
})(IconButton);

export const ResourceListSubheader = withStyles(theme => ({
  root: {
    cursor: 'pointer',
    lineHeight: 'normal',
    paddingTop: '3px',
    paddingBottom: '3px',
  }
}))(ListSubheader);

export const ResourceSubheaderBadge = withStyles(theme => ({
  badge: {
    width: '25px',
    height: '14px',
    top: '-3px',
    right: '-30px',
    fontSize: '10px',
    backgroundColor: '#dddddd',
    borderRadius: '8px'
  },
  colorError: {
    width: '25px',
    height: '14px',
    top: '-3px',
    right: '-30px',
    fontSize: '10px',
    borderRadius: '8px',
    backgroundColor: '#D50000',
  }
}))(Badge);
