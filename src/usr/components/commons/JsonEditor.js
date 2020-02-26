/*
 *     Webcodesk
 *     Copyright (C) 2019  Oleksandr (Alex) Pustovalov
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import stringifyObject from 'stringify-object';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import 'codemirror/mode/javascript/javascript';
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

function parseData (data) {
  return stringifyObject(data, {
    indent: '  ',
    singleQuotes: false
  });
}

class JsonEditor extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    data: PropTypes.any,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    isVisible: false,
    data: undefined,
    onChange: () => {
      console.info('JsonEditor.onChange is not set');
    },
  };

  constructor (props) {
    super(props);
    const { data } = this.props;
    let validScript;
    if (data) {
      validScript = parseData(data);
    }
    this.state = {
      script: validScript || '',
      cursorPosition: null,
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const {isVisible, data} = this.props;
    if (isVisible === true && isVisible !== prevProps.isVisible) {
      this.instance.setCursor(1);
    }
    if (data !== prevProps.data) {
      let validScript;
      if (data) {
        validScript = parseData(data);
      }
      this.setState({
        script: validScript || '',
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
        value = eval(`(${value})`);
      } catch (e) {
        hasErrors = true;
        errorText = e.message;
        value = data;
      }
    } else {
      value = undefined;
    }
    onChange({object: value, hasErrors, errorText });
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
