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
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  topExtraButtonsPane: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '32px',
    right: 0,
    backgroundColor: '#f5f5f5',
  },
  topPane: {
    position: 'absolute',
    top: '32px',
    left: 0,
    height: '38px',
    right: 0,
    borderBottom: '1px solid #dddddd',
  },
  contentPane: {
    position: 'absolute',
    top: '71px',
    bottom: 0,
    right: 0,
    left: 0,
  },
});

class LeftContainer extends React.Component {
  static propTypes = {
    treeView: PropTypes.element,
    topPanel: PropTypes.element,
    searchPanel: PropTypes.element,
  };

  static defaultProps = {
    treeView: null,
    topPanel: null,
    searchPanel: null,
  };

  render () {
    const {classes, treeView, topPanel, searchPanel} = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.topExtraButtonsPane}>
          {topPanel}
        </div>
        <div className={classes.topPane}>
          {searchPanel}
        </div>
        <div className={classes.contentPane}>
          {treeView}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LeftContainer);
