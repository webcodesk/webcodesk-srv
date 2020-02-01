import React from 'react';
import { Link } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

class WarningComponent extends React.Component {

  render () {
    const { message, linkTo, linkLabel } = this.props;
    return (
      <div style={style}>
        <div><code>{message}</code></div>
        {linkTo && <div>&nbsp;&nbsp;<Link to={linkTo}>{linkLabel}</Link></div>}
      </div>
    );
  }
}

export default WarningComponent;
