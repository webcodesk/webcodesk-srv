import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MarkdownView from '../commons/MarkdownView';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    overflow: 'auto'
  },
});

class ReadmePreview extends React.Component {
  static propTypes = {
    readmeText: PropTypes.string,
  };

  static defaultProps = {
    readmeText: '',
  };

  render () {
    const { classes, readmeText } = this.props;
    return (
      <div className={classes.root}>
        <MarkdownView markdownContent={readmeText}/>
      </div>
    );
  }
}

export default withStyles(styles)(ReadmePreview);
