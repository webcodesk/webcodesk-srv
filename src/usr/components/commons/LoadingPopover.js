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
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

const LoadingProgress = withStyles(theme => ({
  root: {
    borderRadius: '4px',
    height: '6px'
  }
}))(LinearProgress);

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 10
  },
  progress: {
    width: '30%',
    padding: '1em',
    marginTop: '20%'
  }
});

class LoadingPopover extends React.Component {
  render () {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.progress}>
          <Typography variant="overline" align="center">Loading...</Typography>
          <div>
            <LoadingProgress />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LoadingPopover);
