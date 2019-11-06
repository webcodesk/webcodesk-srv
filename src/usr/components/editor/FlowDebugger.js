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
import FlowDebuggerManager from '../../core/flowDebugger/FlowDebuggerManager';
import SplitPane from '../splitPane';
import DebuggerDiagram from '../debuggerDiagram/DebuggerDiagram';
import ActionsLogViewer from './ActionsLogViewer';
import { getComponentName } from '../commons/utils';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});

class FlowDebugger extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    actionSequences: PropTypes.object,
    actionsLog: PropTypes.array,
    onSelectNode: PropTypes.func,
  };

  static defaultProps = {
    isVisible: true,
    actionSequences: {},
    actionsLog: [],
    onSelectNode: () => {
      console.info('FlowDebugger.onSelectNode is not set');
    }
  };

  constructor (props) {
    super(props);
    this.state = {
      filteredLogRecords: [],
      localLog: [],
      localFlowTree: {},
      focusedFlowKey: null,
    };
    const {actionSequences, actionsLog} = this.props;
    if (actionSequences) {
      this.flowDebuggerManager = new FlowDebuggerManager(actionSequences);
      this.state.localLog = this.flowDebuggerManager.setDataFromLog(actionsLog);
      this.state.localFlowTree = this.flowDebuggerManager.getFlowModel();
    }
  }

  handleItemPropertyClick = ({key, outputName, inputName}) => {
    const recordsIds = this.flowDebuggerManager.setPropertySelected(key, inputName, outputName);
    this.updateFilteredRecords(recordsIds);
    this.handleSelectNode(null);
  };

  handleItemClick = (key) => {
    const recordsIds = this.flowDebuggerManager.setSelected(key);
    this.updateFilteredRecords(recordsIds);
    this.handleSelectNode(key);
  };

  updateFilteredRecords = (recordsIds) => {
    let filteredLogRecords = [];
    if (recordsIds && recordsIds.length > 0) {
      recordsIds.forEach(recordId => {
        filteredLogRecords = filteredLogRecords.concat(this.state.localLog.filter(i => i.recordId === recordId));
      });
    }
    this.setState({
      localFlowTree: this.flowDebuggerManager.getFlowModel(),
      filteredLogRecords: filteredLogRecords.map(i => i.recordId).sort((a, b) => a.localeCompare(b)),
      focusedFlowKey: null,
    });
  };

  handleOnLogParticleClick = (key) => {
    this.handleItemClick(key);
    this.setState({
      focusedFlowKey: key,
    });
  };

  handleSelectNode = (key) => {
    if (key) {
      const selectedNode = this.flowDebuggerManager.getNode(key);
      if (selectedNode) {
        let searchName;
        let className;
        if (selectedNode && selectedNode.props.title !== 'Application') {
          searchName = selectedNode.props.searchName;
          className = getComponentName(selectedNode.props.componentName);
        }
        this.props.onSelectNode({
          searchName, className
        });
      }
    } else {
      this.props.onSelectNode({
        title: null, className: null
      });
    }
  };

  render () {
    const { localFlowTree, localLog, filteredLogRecords, focusedFlowKey } = this.state;
    if (!localFlowTree) {
      return <h1>Flow tree is not specified</h1>
    }
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <SplitPane
          split="horizontal"
          defaultSize={200}
          primary="second"
        >
          <div className={classes.root}>
            <DebuggerDiagram
              treeData={localFlowTree}
              focusedKey={focusedFlowKey}
              onItemPropertyClick={this.handleItemPropertyClick}
              onItemClick={this.handleItemClick}
            />
          </div>
          <div className={classes.root} style={{overflow: 'auto'}}>
            <ActionsLogViewer
              actionsLog={localLog}
              highlightedRecords={filteredLogRecords}
              onParticleClick={this.handleOnLogParticleClick}
            />
          </div>
        </SplitPane>
      </div>
    );
  }
}

export default withStyles(styles)(FlowDebugger);
