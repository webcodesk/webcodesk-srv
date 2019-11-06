import React from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

const MarketLoadingProgress = withStyles(theme => ({
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

class MarketLoadingPopover extends React.Component {
  render () {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.progress}>
          <Typography variant="overline" align="center">Loading...</Typography>
          <div>
            <MarketLoadingProgress />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(MarketLoadingPopover);
