import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  placeholder: {
    padding: '1em',
    border: '1px dashed #cccccc',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dddddd'
  }
});

const Placeholder = ({title, height, classes}) => {
  const style = {};
  if (height) {
    style.height = height;
  }
  return (
    <div className={classes.placeholder} style={style}>
      <code>
        {title}
      </code>
    </div>
  );
};

Placeholder.propTypes = {
  title: PropTypes.string,
  height: PropTypes.string,
};

Placeholder.defaultProps = {
  title: 'no title',
  height: null,
};

export default withStyles(styles)(Placeholder);