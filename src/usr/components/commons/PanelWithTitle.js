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
    title: PropTypes.string,
    propsSampleObjectText: PropTypes.string,
  };

  static defaultProps = {
    title: null,
  };

  // constructor (props, context) {
  //   super(props, context);
  // }

  render () {
    const { classes, title, children } = this.props;
    return (
      <div className={classes.root}>
        {title && (
          <div className={classes.titleBar}>
            <Typography variant="subtitle2" className={classes.titleText}>
              {title}
            </Typography>
          </div>
        )}
        <div className={classes.contentWrapper}>
          {children}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PanelWithTitle);
