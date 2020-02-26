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
import Typography from '@material-ui/core/Typography';

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
  error: {
    width: '30%',
    padding: '1em',
    marginTop: '20%'
  },
  errorText: {
    color: '#D50000',
  }
});

class MarketErrorPopover extends React.Component {
  render () {
    const { classes, error } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.error}>
          <Typography className={classes.errorText} variant="overline" align="center">{error}</Typography>
        </div>
      </div>
    );
  }
}

MarketErrorPopover.propTypes = {
  error: PropTypes.string,
};

MarketErrorPopover.defaultProps = {
  error: ''
};

export default withStyles(styles)(MarketErrorPopover);
