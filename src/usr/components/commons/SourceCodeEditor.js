/*
 *    Copyright 2019 Alex (Oleksandr) Pustovalov
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

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
import { getSourceAst } from '../../core/utils/babelParser';

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
    checkSyntax: PropTypes.bool,
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
    this.doc = editor.getDoc();
  };

  debouncedHandleOnChange = debounce((editor, data, value) => {
    this.handleOnChange(editor, data, value);
  }, 500);

  handleOnChange = (editor, data, value) => {
    let hasError = false;
    let errorText = '';
    if (this.markPos) {
      this.markPos.clear();
    }
    if (this.props.checkSyntax) {
      if (value && value.length > 0) {
        try {
          getSourceAst(value);
        } catch (e) {
          if (e && e.loc) {
            const { loc: { line, column } } = e;
            if (line >= 1 && column >= 1) {
              this.markPos = this.doc.markText(
                { line: line - 1, ch: column },
                { line: line - 1, ch: column + 1 },
                { css: 'color: #D50000; outline: 1px dotted #D50000;' }
              );
            }
          }
          hasError = true;
          errorText = e.message;
          value = this.state.script;
        }
      } else {
        value = undefined;
      }
    }
    this.props.onChange({script: value, hasError, errorText});
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
