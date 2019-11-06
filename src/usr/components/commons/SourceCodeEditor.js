import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import { Controlled as CodeMirror } from 'react-codemirror2'
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

class SourceCodeEditor extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    data: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    isVisible: false,
    data: {},
    onChange: () => {
      console.info('SourceCodeEditor.onChange is not set');
    },
  };

  constructor (props) {
    super(props);
    const { data } = this.props;
    this.state = {
      script: data.script,
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const {isVisible, data} = this.props;
    if (isVisible === true && isVisible !== prevProps.isVisible) {
      this.instance.setCursor(1);
    }
    if (data !== prevProps.data) {
      this.setState({
        script: data.script,
      });
    }
  }

  handleEditorDidMount = (editor) => {
    this.instance = editor;
  };

  debouncedHandleOnChange = debounce((editor, data, value) => {
    this.handleOnChange(editor, data, value);
  }, 500);

  handleOnChange = (editor, data, value) => {
    let hasErrors = false;
    // try {
    // todo:  parse source code value somehow here
    // } catch (e) {
    //   hasErrors = true;
    // }
    this.props.onChange({script: value, hasErrors});
  };

  handleBeforeChange =(editor, data, value) => {
    this.setState({
      script: value,
    })
  };

  render () {
    const { classes } = this.props;
    return (
      <CodeMirror
        className={classes.root}
        value={this.state.script}
        editorDidMount={this.handleEditorDidMount}
        options={{
          mode: 'jsx',
          theme: 'idea',
          lineNumbers: true,
          tabMode: 'indent',
          tabSize: 2,
          indentUnit: 2,
          indentWithTabs: false,
          smartIndent: true,
          extraKeys: {
            Tab: function(cm) {
              if(cm.somethingSelected())
                cm.indentSelection("add");
              else
                cm.execCommand("insertSoftTab");
            },
            "Shift-Tab": function(cm) {
              cm.indentSelection("subtract");
            }
          }
        }}
        onBeforeChange={this.handleBeforeChange}
        onChange={this.debouncedHandleOnChange}
      />
    );
  }
}

export default withStyles(styles)(SourceCodeEditor);
