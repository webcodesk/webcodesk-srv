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
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentWrapper: {
    position: 'absolute',
    top: '32px',
    left: 0,
    right: 0,
    bottom: 0,
    padding: '5px',
    overflow: 'auto',
  },
  contentWrapperNoOverflow: {
    position: 'absolute',
    top: '32px',
    left: 0,
    right: 0,
    bottom: 0,
    padding: '5px',
    overflow: 'hidden',
  },
  coverContentWrapper: {
    position: 'absolute',
    top: '32px',
    left: 0,
    right: 0,
    bottom: 0,
    // boxShadow: '0 22px 22px -22px rgba(255, 255, 255, 0.8) inset, 0 -22px 22px -22px rgba(255, 255, 255, 0.8) inset',
    zIndex: 5,
  },
  titleBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
    padding: '5px',
    overflow: 'hidden',
  },
  titleText: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
});

class PanelWithTitle extends React.Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    noOverflow: PropTypes.bool,
  };

  static defaultProps = {
    title: null,
    noOverflow: false,
  };

  // constructor (props, context) {
  //   super(props, context);
  // }

  render () {
    const { classes, title, noOverflow, children } = this.props;
    return (
      <div className={classes.root}>
        {title && (
          <div className={classes.titleBar}>
            <Typography variant="subtitle2" className={classes.titleText}>
              {title}
            </Typography>
          </div>
        )}
        <div className={noOverflow ? classes.contentWrapperNoOverflow : classes.contentWrapper}>
          {children}
        </div>
        {/*{noOverflow && (*/}
        {/*  <div className={classes.coverContentWrapper} />*/}
        {/*)}*/}
      </div>
    );
  }
}

export default withStyles(styles)(PanelWithTitle);
