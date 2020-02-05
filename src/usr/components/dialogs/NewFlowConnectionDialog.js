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
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

function initNextStepBySelectedOutput(outputConnectionTargets, flowConnectionsMap) {
  const flowStep = {
    possibleConnectionTargets: [],
    selectedTargetIndex: -1,
    selectedTargetOutputIndex: -1
  };
  if (flowConnectionsMap && outputConnectionTargets && outputConnectionTargets.length > 0) {
    let foundPossibleConnectionTarget;
    for (let i = 0; i < outputConnectionTargets.length; i++) {
      foundPossibleConnectionTarget = flowConnectionsMap.get(outputConnectionTargets[i]);
      if (foundPossibleConnectionTarget) {
        flowStep.possibleConnectionTargets.push(foundPossibleConnectionTarget);
      }
    }
  }
  return flowStep;
}

class NewFlowConnectionDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    outputConnectionTargets: PropTypes.array,
    flowConnectionsMap: PropTypes.object,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    outputConnectionTargets: null,
    flowConnectionsMap: null,
    onClose: () => {
      console.info('NewFlowConnectionDialog.onClose is not set');
    },
    onSubmit: (options) => {
      console.info('NewFlowConnectionDialog.onSubmit is not set: ', options);
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      flowSteps: [],
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const {isOpen, outputConnectionTargets, flowConnectionsMap} = this.props;
    const { flowSteps } = this.state;
    return isOpen !== nextProps.isOpen
      || outputConnectionTargets !== nextProps.outputConnectionTargets
      || flowConnectionsMap !== nextProps.flowConnectionsMap
      || flowSteps !== nextState.flowSteps;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { isOpen, outputConnectionTargets, flowConnectionsMap } = this.props;
    if (isOpen && !prevProps.isOpen) {
      this.setState({
        flowSteps: [
          initNextStepBySelectedOutput(outputConnectionTargets, flowConnectionsMap)
        ]
      });
    }
  }

  handleClose = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onClose(false);
  };

  handleSubmit = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  handleConnectionTargetSelect = (flowStepIndex, connectionTargetIndex) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    console.info('handleConnectionTargetSelect (flowStepIndex): ', flowStepIndex);
    console.info('handleConnectionTargetSelect (connectionTargetIndex): ', connectionTargetIndex);
    const flowSteps = this.state.flowSteps.slice(0, flowStepIndex + 1);
    flowSteps[flowStepIndex].selectedTargetIndex = connectionTargetIndex;
    this.setState({
      flowSteps,
    });
  };

  handleConnectionTargetOutputSelect = (flowStepIndex, connectionTargetOutputIndex) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { flowConnectionsMap } = this.props;
    const flowSteps = this.state.flowSteps.slice(0, flowStepIndex + 1);
    const { possibleConnectionTargets, selectedTargetIndex } = flowSteps[flowStepIndex];
    const selectedTarget = possibleConnectionTargets[selectedTargetIndex];
    if (selectedTarget) {
      const { outputs } = selectedTarget;
      if (outputs && outputs.length > 0) {
        const selectedTargetOutput = outputs[connectionTargetOutputIndex];
        if (selectedTargetOutput && selectedTargetOutput.possibleConnectionTargets) {
          flowSteps.push(
            initNextStepBySelectedOutput(selectedTargetOutput.possibleConnectionTargets, flowConnectionsMap)
          );
        }
        flowSteps[flowStepIndex].selectedTargetOutputIndex = connectionTargetOutputIndex;
        this.setState({
          flowSteps,
        });
      }
    }
  };

  render () {
    const { isOpen, outputConnectionTargets, flowConnectionsMap } = this.props;
    if (!isOpen) {
      return null;
    }
    console.info('outputConnectionTargets: ', outputConnectionTargets);
    console.info('flowConnectionsMap: ', flowConnectionsMap);
    const { flowSteps } = this.state;
    const gridColumns = [];
    if (flowSteps && flowSteps.length > 0) {
      for (let i = 0; i < flowSteps.length; i++) {
        let connectionTargetElements = [];
        const {possibleConnectionTargets, selectedTargetIndex } = flowSteps[i];
        let selectedTarget;
        if (possibleConnectionTargets && possibleConnectionTargets.length > 0) {
          for (let p = 0; p < possibleConnectionTargets.length; p++) {
            connectionTargetElements.push(
              <div key={`target${p}`} onClick={this.handleConnectionTargetSelect(i, p)}>
                <pre>
                  <code>
                    {JSON.stringify(possibleConnectionTargets[p], null, 4)}
                  </code>
                </pre>
              </div>
            );
            if (p === selectedTargetIndex) {
              selectedTarget = possibleConnectionTargets[p];
            }
          }
        }
        gridColumns.push(
          <div
            key={`column${i}`}
          >
            <div style={{height: '1em'}}>Possible connection variants</div>
            <div
              style={{
                border: '1px solid #cdcdcd',
                borderRadius: '4px',
                overflowY: 'auto',
                height: '400px',
              }}
            >
              {connectionTargetElements}
            </div>
            <div style={{height: '1em'}} />
          </div>
        );
        if (selectedTarget) {
          const { outputs } = selectedTarget;
          const connectionTargetOutputElements = [];
          if (outputs && outputs.length > 0) {
            for (let o = 0; o < outputs.length; o++) {
              connectionTargetOutputElements.push(
                <div key={`output${o}`} onClick={this.handleConnectionTargetOutputSelect(i, o)}>
                  <pre>
                    <code>
                      {JSON.stringify(outputs[o], null, 4)}
                    </code>
                  </pre>
                </div>
              )
            }
          }
          gridColumns.push(
            <div
              key={`outputsColumn${i}`}
            >
              <div style={{height: '1em'}}>Selected outputs</div>
              <div
                style={{
                  border: '1px solid #cdcdcd',
                  borderRadius: '4px',
                  overflowY: 'auto',
                  height: '400px',
                }}
              >
                {connectionTargetOutputElements}
              </div>
              <div style={{height: '1em'}} />
            </div>
          );
        }
      }
    }
    if (gridColumns.length < 6) {
      for (let x = gridColumns.length; x < 6; x++) {
        gridColumns.push(
          <div
            key={`column${x}`}
          >
            <div style={{height: '1em'}} />
            <div
              style={{
                border: '1px solid #cdcdcd',
                borderRadius: '4px',
                overflowY: 'auto',
                height: '400px',
              }}
            />
            <div style={{height: '1em'}} />
          </div>
        );
      }
    }
    return (
      <Dialog
        aria-labelledby="NewFlowConnectionDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        fullWidth={false}
        maxWidth="xl"
        scroll="body"
      >
        <DialogContent>
          <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
            <div
              style={{
                width: `${300 * gridColumns.length}px`,
                display: 'grid',
                gridTemplateColumns: `repeat(${gridColumns.length}, 1fr)`,
                gridGap: '1em',
                justifyContent: 'start',
              }}
            >
              {gridColumns}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" onClick={this.handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default NewFlowConnectionDialog;
