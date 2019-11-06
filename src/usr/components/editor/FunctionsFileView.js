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
import { withStyles } from '@material-ui/core/styles';
import { CommonToolbar, CommonToolbarDivider } from '../commons/Commons.parts';
import ToolbarButton from '../commons/ToolbarButton';
import SourceCodeEditor from '../commons/SourceCodeEditor';
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
  centralPane: {
    position: 'absolute',
    top: '39px',
    bottom: 0,
    right: 0,
    left: 0,
  },
  topPane: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '39px',
    right: 0,
    minWidth: '800px'
  },
  gridContainer: {
    minWidth: '600px',
    padding: '30px',
  }
});

class FunctionsFileView extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    data: PropTypes.object,
    onSearch: PropTypes.func,
    onSaveChanges: PropTypes.func,
  };

  static defaultProps = {
    isVisible: true,
    data: {},
    onSearch: () => {
      console.info('FunctionsFileView.onSearch is not set');
    },
    onSaveChanges: () => {
      console.info('FunctionsFileView.onSaveChanges is not set');
    },
  };

  constructor (props) {
    super(props);
    const { data } = this.props;
    this.state = {
      isSourceCodeOpen: false,
      localSourceCode: '',
      markdownContent: data ? data.readmeText : '',
      sourceCodeUpdateCounter: 0,
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { data, isVisible } = this.props;
    const { sourceCodeUpdateCounter, isSourceCodeOpen } = this.state;
    if (prevProps.isVisible !== isVisible) {
      if (!isVisible && sourceCodeUpdateCounter > 0) {
        this.handleSaveChanges();
      }
    }
    if (data) {
      if (data !== prevProps.data && sourceCodeUpdateCounter === 0) {
        data.sourceCode.then(sourceCodeData => {
          this.setState({
            localSourceCode: sourceCodeData || '',
          });
        });
        this.setState({
          markdownContent: data.readmeText || '',
        });
      } else if (isSourceCodeOpen && !prevState.isSourceCodeOpen) {
        data.sourceCode.then(sourceCodeData => {
          this.setState({
            localSourceCode: sourceCodeData || '',
          });
        });
      }
    }
  }

  handleToggleSourceCode = () => {
    this.setState({
      isSourceCodeOpen: !this.state.isSourceCodeOpen,
    });
  };

  handleChangeSourceCode = ({ script, hasErrors }) => {
    this.setState({
      localSourceCode: script,
      sourceCodeUpdateCounter: this.state.sourceCodeUpdateCounter + 1
    });
  };

  handleSaveChanges = () => {
    this.props.onSaveChanges(this.state.localSourceCode);
    this.setState({
      sourceCodeUpdateCounter: 0
    });
  };

  render () {
    const { classes } = this.props;
    const { localSourceCode, markdownContent, sourceCodeUpdateCounter, isSourceCodeOpen } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.topPane}>
          {isSourceCodeOpen
            ? (
              <CommonToolbar disableGutters={true} dense="true">
                <ToolbarButton
                  iconType="ArrowBack"
                  title="Functions Descriptions"
                  onClick={this.handleToggleSourceCode}
                  tooltip="Switch to the functions descriptions view"
                />
                <CommonToolbarDivider/>
                <ToolbarButton
                  iconType="Save"
                  iconColor="#4caf50"
                  title="Save Changes"
                  onClick={this.handleSaveChanges}
                  tooltip="Save recent changes"
                  switchedOn={sourceCodeUpdateCounter > 0}
                  disabled={sourceCodeUpdateCounter === 0}
                />
              </CommonToolbar>
            )
            : (
              <CommonToolbar disableGutters={true} dense="true">
                <ToolbarButton
                  iconType="Edit"
                  title="Source Code"
                  onClick={this.handleToggleSourceCode}
                  tooltip="Switch to the source code editor"
                />
              </CommonToolbar>
            )
          }
        </div>
        <div className={classes.centralPane}>
          {isSourceCodeOpen
            ? (
              <SourceCodeEditor
                isVisible={true}
                data={{ script: localSourceCode }}
                onChange={this.handleChangeSourceCode}
              />
            )
            : (
              <div className={classes.root}>
                <MarkdownView markdownContent={markdownContent} />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(FunctionsFileView);
