import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Placeholder from './Placeholder';

const styles = theme => ({
  root: {
    display: 'grid',
    gridGap: '1em',
    gridTemplateColumns: '300px minmax(200px, auto)',
  },
  cell1: {
    position: 'relative',
    gridColumn: '1',
    gridRow: '1',
  },
  cell2: {
    position: 'relative',
    gridColumn: '2',
    gridRow: '1',
  },
  cell3: {
    position: 'relative',
    gridColumn: '1',
    gridRow: '2',
  },
  cell4: {
    position: 'relative',
    gridColumn: '2',
    gridRow: '2',
  },
  cell13: {
    position: 'relative',
    gridColumn: '1',
    gridRow: '1/3',
  }
});

const ComponentPublishLayout = (props) => {
  const {classes, cell1, cell2, cell3, cell4, cell13} = props;
  return (
    <div className={classes.root}>
      {!cell13 && (
        <div className={classes.cell1}>
          {cell1}
        </div>
      )}
      {cell13 && (
        <div className={classes.cell13}>
          {cell13}
        </div>
      )}
      <div className={classes.cell2}>
        {cell2}
      </div>
      {!cell13 && (
        <div className={classes.cell3}>
          {cell3}
        </div>
      )}
      <div className={classes.cell4}>
        {cell4}
      </div>
    </div>
  );
};

ComponentPublishLayout.propTypes = {
  cell1: PropTypes.element,
  cell2: PropTypes.element,
  cell3: PropTypes.element,
  cell4: PropTypes.element,
  cell13: PropTypes.element,
};

ComponentPublishLayout.defaultProps = {
  cell1: <Placeholder title="cell1" />,
  cell2: <Placeholder title="cell2" />,
  cell3: <Placeholder title="cell3" />,
  cell4: <Placeholder title="cell4" />,
  cell13: null,
};

export default withStyles(styles)(ComponentPublishLayout);