import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'min-content',
    gridGap: '8px',
    alignItems: 'flex-start'
  }
});

class Grid1ColumnVerticalRows extends React.Component {
  render () {
    const {classes, children} = this.props;
    return (
      <div className={classes.root}>
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(Grid1ColumnVerticalRows);
