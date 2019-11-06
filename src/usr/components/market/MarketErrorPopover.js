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
