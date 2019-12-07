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
import 'codemirror/mode/javascript/javascript';
import { Controlled as CodeMirror } from 'react-codemirror2'
import { withStyles } from '@material-ui/core/styles';
import { generateSource, getSourceAst } from '../../core/utils/babelParser';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

function parseScript (script) {
  try {
    const validCode = `const s = ${script}`;
    const objectAST = getSourceAst(validCode);
    const { code } = generateSource(objectAST, validCode);
    return code.substr(0, code.length - 1).replace('const s = ', '');
  } catch (e) {
    return script;
  }
}

class JsonEditor extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    data: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    isVisible: false,
    data: {},
    onChange: () => {
      console.info('JsonEditor.onChange is not set');
    },
  };

  constructor (props) {
    super(props);
    const { data } = this.props;
    let validScript;
    if (data.script) {
      validScript = parseScript(data.script);
    } else {
      validScript = data.script;
    }
    this.state = {
      script: validScript,
      cursorPosition: null,
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const {isVisible, data} = this.props;
    if (isVisible === true && isVisible !== prevProps.isVisible) {
      this.instance.setCursor(1);
    }
    if (data && prevProps.data && data !== prevProps.data && data.script !== prevProps.data.script) {
      let validScript;
      if (data.script) {
        validScript = parseScript(data.script);
      } else {
        validScript = data.script;
      }
      this.setState({
        script: validScript,
      });
    }
  }

  handleEditorDidMount = (editor) => {
    this.instance = editor;
  };

  debouncedHandleOnChange = debounce((editor, data, value) => {
    this.handleOnChange(editor, data, value);
  }, 500);

  handleOnChange = (editor, editorData, value) => {
    let hasErrors = false;
    let errorText = '';
    const { data, onChange } = this.props;
    if (value && value.length > 0) {
      try {
        getSourceAst(`const s = ${value}`);
        const resultValue = eval(`(${value})`);
        value = JSON.stringify(resultValue);
      } catch (e) {
        hasErrors = true;
        errorText = e.message;
        value = data ? data.script : '';
      }
    }
    onChange({script: value, hasErrors, errorText });
  };

  handleBeforeChange = (editor, data, value) => {
    this.setState({
      script: value,
    });
  };

  render () {
    const { classes } = this.props;
    return (
      <CodeMirror
        className={classes.root}
        value={this.state.script}
        editorDidMount={this.handleEditorDidMount}
        options={{
          mode: {
            name: 'javascript',
            json: true,
          },
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

export default withStyles(styles)(JsonEditor);
