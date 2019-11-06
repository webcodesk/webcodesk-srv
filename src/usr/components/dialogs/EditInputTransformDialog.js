import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import ScriptView from '../commons/ScriptView';
import SplitPane from '../splitPane';
import SourceCodeEditor from '../commons/SourceCodeEditor';
import PanelWithTitle from '../commons/PanelWithTitle';

const styles = theme => ({
  dialogContent: {
    position: 'relative',
    width: '100%',
    height: '800px',
    border: '1px solid #dddddd',
  },
  editorWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sampleWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  errorText: {
    color: '#D50000',
  },
});

class EditInputTransformDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    outputSampleScript: PropTypes.string,
    inputSampleScript: PropTypes.string,
    testDataScript: PropTypes.string,
    transformScript: PropTypes.string,
    errors: PropTypes.array,
    output: PropTypes.array,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    onTest: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    outputSampleScript: '',
    inputSampleScript: '',
    testDataScript: '',
    transformScript: '',
    errors: [],
    output: [],
    isOpen: false,
    onClose: () => {
      console.info('EditInputTransformDialog.onClose is not set');
    },
    onSubmit: (options) => {
      console.info('EditInputTransformDialog.onSubmit is not set: ', options);
    },
    onTest: (options) => {
      console.info('EditInputTransformDialog.onTest is not set: ', options);
    },
  };

  constructor (props) {
    super(props);
    const { testDataScript, transformScript } = this.props;
    this.state = {
      testEditorDataObject: {
        script: testDataScript,
      },
      transformEditorDataObject: {
        script: transformScript,
      }
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { testDataScript, transformScript } = this.props;
    if (testDataScript !== prevProps.testDataScript) {
      this.setState({
        testEditorDataObject: {
          script: testDataScript
        }
      });
    }
    if (transformScript !== prevProps.transformScript) {
      this.setState({
        transformEditorDataObject: {
          script: transformScript
        }
      });
    }
  }

  handleClose = () => {
    this.props.onClose(false);
  };

  handleSubmit = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { testEditorDataObject, transformEditorDataObject } = this.state;
    this.props.onSubmit({
      testDataScript: testEditorDataObject.script,
      transformScript: transformEditorDataObject.script,
    });
  };

  handleTest = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { testEditorDataObject, transformEditorDataObject } = this.state;
    this.props.onTest({
      testDataScript: testEditorDataObject.script,
      transformScript: transformEditorDataObject.script,
    });
  };

  handleChangeTestScript = ({ script, hasErrors }) => {
    const newState = { ...this.state };
    newState.testEditorDataObject = newState.testEditorDataObject || {};
    newState.testEditorDataObject.script = script;
    this.setState(newState);
  };

  handleChangeTransformScript = ({ script, hasErrors }) => {
    const newState = { ...this.state };
    newState.transformEditorDataObject = newState.transformEditorDataObject || {};
    newState.transformEditorDataObject.script = script;
    this.setState(newState);
  };

  render () {
    const { isOpen, classes, title, inputSampleScript, outputSampleScript, errors, output } = this.props;
    if (!isOpen) {
      return null;
    }
    const {
      activeTabIndex,
      testEditorDataObject,
      transformEditorDataObject
    } = this.state;
    return (
      <Dialog
        aria-labelledby="EditInputTransformDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        maxWidth="md"
        fullWidth={true}
        scroll="body"
      >
        <form onSubmit={this.handleSubmit}>
          <DialogTitle id="EditInputTransformDialog-dialog-title" disableTypography={true}>
            {title
              ? title
              : 'Edit Input Transformation Script'
            }
          </DialogTitle>
          <DialogContent>
            <div className={classes.dialogContent}>
              <SplitPane
                split="horizontal"
                defaultSize={500}
                primary="first"
              >
                <div>
                  <SplitPane
                    split="vertical"
                    defaultSize={300}
                    primary="first"
                  >
                    <div>
                      <SplitPane
                        split="horizontal"
                        defaultSize={250}
                        primary="first"
                      >
                        <div className={classes.sampleWrapper}>
                          <PanelWithTitle title="Output endpoint sample object">
                            <ScriptView
                              propsSampleObjectText={outputSampleScript}
                            />
                          </PanelWithTitle>
                        </div>
                        <div className={classes.sampleWrapper}>
                          <PanelWithTitle title="Input endpoint sample object">
                            <ScriptView
                              propsSampleObjectText={inputSampleScript}
                            />
                          </PanelWithTitle>
                        </div>
                      </SplitPane>
                    </div>
                    <div>
                      <SplitPane
                        split="horizontal"
                        defaultSize={250}
                        primary="first"
                      >
                        <div className={classes.editorWrapper}>
                          <PanelWithTitle title="Output endpoint test script">
                            <SourceCodeEditor
                              data={testEditorDataObject}
                              isVisible={activeTabIndex === 0}
                              onChange={this.handleChangeTestScript}
                            />
                          </PanelWithTitle>
                        </div>
                        <div className={classes.editorWrapper}>
                          <PanelWithTitle title="Transformation script">
                            <SourceCodeEditor
                              data={transformEditorDataObject}
                              isVisible={activeTabIndex === 1}
                              onChange={this.handleChangeTransformScript}
                            />
                          </PanelWithTitle>
                        </div>
                      </SplitPane>
                    </div>
                  </SplitPane>
                </div>
                <div>
                  <PanelWithTitle title="Execution result">
                    {errors && errors.length > 0 && (
                      <Typography variant="overline" component="h4">Errors:</Typography>
                    )}
                    {errors && errors.length > 0 && (
                      errors.map((error, idx) => {
                        return (
                          <Typography
                            key={`error_${idx}`}
                            component="h4"
                            variant="body2"
                            gutterBottom={idx < errors.length - 1}
                            className={classes.errorText}
                          >
                            {error}
                          </Typography>
                        );
                      })
                    )}
                    {output && output.length > 0 && (
                      <Typography variant="overline" component="h4">Data on input endpoint:</Typography>
                    )}
                    {output && output.length > 0 && (
                      output.map((outputItem, idx) => {
                        return (
                          <ScriptView
                            key={`executionResult_${idx}`}
                            propsSampleObjectText={outputItem}
                          />
                        );
                      })
                    )}
                  </PanelWithTitle>
                </div>
              </SplitPane>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleTest} color="primary">
              Test
            </Button>
            <Button type="submit" onClick={this.handleSubmit} color="primary">
              Test & Close
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditInputTransformDialog);
