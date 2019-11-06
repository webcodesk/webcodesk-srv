import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import 'codemirror/mode/javascript/javascript';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

class AceEditor extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    data: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    isVisible: false,
    data: {},
    onChange: () => {
      console.info('AceEditor.onChange is not set');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      script: this.props.data ? JSON.stringify(this.props.data, null, 4) : '',
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const {isVisible} = this.props;
    if (isVisible === true && isVisible !== prevProps.isVisible) {
      this.instance.setCursor(1);
    }
  }

  debouncedHandleOnChange = debounce((editor, data, value) => {
    this.handleOnChange(editor, data, value);
  }, 500);

  handleOnChange = (editor, data, value) => {
    let hasErrors = false;
    let dataObj = null;
    try {
      dataObj = JSON.parse(value);
    } catch (e) {
      hasErrors = true;
    }
    this.props.onChange({data: dataObj, hasErrors});
  };

  render () {
    const { classes } = this.props;
    return (
      <CodeMirror
        className={classes.root}
        value={this.state.script}
        editorDidMount={editor => { this.instance = editor }}
        options={{
          theme: 'idea',
          mode: 'javascript',
          json: true,
          lineNumbers: true,
          tabSize: 4,
          smartIndent: false,
        }}
        onChange={this.debouncedHandleOnChange}
      />
    );
  }
}

export default withStyles(styles)(AceEditor);
