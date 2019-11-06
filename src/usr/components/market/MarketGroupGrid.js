import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 350px))',
    gridGap: '16px',
    marginBottom: '10em'
  }
});

class MarketGroupGrid extends React.Component {
  render () {
    const {classes, children} = this.props;
    return (
      <div className={classes.root}>
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(MarketGroupGrid);
