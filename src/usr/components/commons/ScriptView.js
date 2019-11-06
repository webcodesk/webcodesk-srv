import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { highlightBlock } from 'usr/components/commons/utils';

const styles = theme => ({
  codeBlock: {
    fontSize: '12px',
    borderRadius: '4px',
    backgroundColor: theme.palette.background.paper,
    padding: 0,
  },
  formatted: {
    border: 0,
    // backgroundColor: theme.palette.background.paper,
    padding: 0,
  }
});

class ScriptView extends React.Component {
  static propTypes = {
    propsSampleObjectText: PropTypes.string,
    extraClassName: PropTypes.string,
  };

  static defaultProps = {
    propsSampleObjectText: '',
    extraClassName: ''
  };

  constructor (props, context) {
    super(props, context);
    this.codeBlock = React.createRef();
  }

  componentDidMount () {
    if (this.codeBlock.current) {
      highlightBlock(this.codeBlock.current);
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.codeBlock.current) {
      highlightBlock(this.codeBlock.current);
    }
  }

  render () {
    const { classes, propsSampleObjectText, extraClassName } = this.props;
    if (propsSampleObjectText) {
      return (
        <pre className={classes.formatted}>
          <code
            ref={this.codeBlock}
            className={`${classes.codeBlock} ${extraClassName || ''}`}
          >
            {propsSampleObjectText}
          </code>
        </pre>
      );
    }
    return (
      <p>Empty</p>
    );
  }
}

export default withStyles(styles)(ScriptView);
