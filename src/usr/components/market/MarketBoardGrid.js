import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'min-content',
    gridGap: '0px',
    alignItems: 'start',
    justifyContent: 'start',
    marginBottom: '5em'
  }
});

class MarketBoardGrid extends React.Component {
  render () {
    const {classes, children} = this.props;
    return (
      <div className={classes.root}>
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(MarketBoardGrid);
