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
