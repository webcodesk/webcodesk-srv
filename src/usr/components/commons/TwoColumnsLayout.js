import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'grid',
    gridGap: '1em',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center'
  },
});

const TwoColumnsLayout = (props) => {
  const {classes, children} = props;
  return (
    <div className={classes.root}>
      {children}
    </div>
  );
};

export default withStyles(styles)(TwoColumnsLayout);
