import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FastForward from '@material-ui/icons/FastForward';
import IconButton from '@material-ui/core/IconButton';
import SplitPane from '../splitPane';
import ScriptView from '../commons/ScriptView';
import ToolbarButton from '../commons/ToolbarButton';
import EditInputTransformDialog from '../dialogs/EditInputTransformDialog';
import FlowInputTransformManager from '../../core/flowComposer/FlowInputTransformManager';
import PanelWithTitle from '../commons/PanelWithTitle';
import { showConfirmationDialog } from '../../core/utils/serverUtils';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  rootEmpty: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1em'
  },
  outputSamplePane: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  transformFunctionPane: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  inputSamplePane: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  transformEditButton: {
    position: 'absolute',
    bottom: '1em',
    left: '0.5em',
    zIndex: 5,
  },
  transformDeleteButton: {
    position: 'absolute',
    bottom: '1em',
    right: '1em',
    zIndex: 5,
  },
  transformIcon: {
    border: '1px solid #cdcdcd',
    borderRadius: '50%'
  }
});

class FlowInputTransformEditor extends React.Component {
  static propTypes = {
    selectedNodeModel: PropTypes.object,
    parentNodeModel: PropTypes.object,
    selectedInputModel: PropTypes.object,
    parentOutputModel: PropTypes.object,
    onUpdateTransformScript: PropTypes.func,
  };

  static defaultProps = {
    selectedNodeModel: null,
    parentNodeModel: null,
    selectedInputModel: null,
    parentOutputModel: null,
    onUpdateTransformScript: () => {
      console.info('FlowInputTransformEditor.onUpdateTransformScript is not set');
    },
  };

  constructor (props) {
    super(props);
    this.flowInputTransformManager = new FlowInputTransformManager();
    this.state = {
      isEditInputTransformDialogOpen: false,
      editInputTransformDialogErrors: [],
      editInputTransformDialogOutput: [],
      editInputTransformDialogTestDataScript: '',
      editInputTransformDialogTransformationScript: '',
      outputSampleObjectText: '',
      inputSampleObjectText: '',
      transformationScript: '',
    };
  }

  componentDidMount () {
    const { parentOutputModel, selectedInputModel } = this.props;
    if (selectedInputModel) {
      this.flowInputTransformManager.setTransformScript(selectedInputModel.transformScript);
      this.flowInputTransformManager.setTestDataScript(selectedInputModel.testDataScript);
      this.flowInputTransformManager.setInputPropertiesModel(selectedInputModel.properties);
      this.setState({
        inputSampleObjectText: this.flowInputTransformManager.getInputSampleObjectText(),
        transformationScript: this.flowInputTransformManager.getTransformScript(),
        editInputTransformDialogTransformationScript: this.flowInputTransformManager.getDefaultTransformScript(),
      });
    }
    if (parentOutputModel) {
      this.flowInputTransformManager.setOutputPropertiesModel(parentOutputModel.properties);
      this.setState({
        outputSampleObjectText: this.flowInputTransformManager.getOutputSampleObjectText(),
        editInputTransformDialogTestDataScript: this.flowInputTransformManager.getDefaultTestDataScript(),
      });
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { parentOutputModel, selectedInputModel } = this.props;
    if (selectedInputModel && selectedInputModel !== prevProps.selectedInputModel) {
      this.flowInputTransformManager.setTransformScript(selectedInputModel.transformScript);
      this.flowInputTransformManager.setTestDataScript(selectedInputModel.testDataScript);
      this.flowInputTransformManager.setInputPropertiesModel(selectedInputModel.properties);
      this.setState({
        inputSampleObjectText: this.flowInputTransformManager.getInputSampleObjectText(),
        transformationScript: this.flowInputTransformManager.getTransformScript(),
        editInputTransformDialogTransformationScript: this.flowInputTransformManager.getDefaultTransformScript(),
      });
    }
    if (parentOutputModel && parentOutputModel !== prevProps.parentOutputModel) {
      this.flowInputTransformManager.setOutputPropertiesModel(parentOutputModel.properties);
      this.setState({
        outputSampleObjectText: this.flowInputTransformManager.getOutputSampleObjectText(),
        editInputTransformDialogTestDataScript: this.flowInputTransformManager.getDefaultTestDataScript(),
      });
    }
  }

  handleOpenEditInputTransformDialog = () => {
    this.setState({
      isEditInputTransformDialogOpen: true,
    });
  };

  handleCloseEditInputTransformDialog = () => {
    this.setState({
      isEditInputTransformDialogOpen: false,
      editInputTransformDialogErrors: [],
      editInputTransformDialogOutput: [],
    });
  };

  handleTestEditInputTransformDialog = (options) => {
    const {
      testDataScript,
      transformScript,
    } = options;

    const {errors, output} = this.flowInputTransformManager.testTransformScript(testDataScript, transformScript);

    this.setState({
      editInputTransformDialogErrors: errors,
      editInputTransformDialogOutput: output,
    });

  };

  handleSubmitEditInputTransformDialog = (options) => {
    const {
      testDataScript,
      transformScript,
    } = options;

    const {errors} = this.flowInputTransformManager.testTransformScript(testDataScript, transformScript);

    if (errors && errors.length === 0) {
      this.setState({
        isEditInputTransformDialogOpen: false,
        editInputTransformDialogErrors: [],
        editInputTransformDialogOutput: [],
      });
      const { onUpdateTransformScript, selectedNodeModel, selectedInputModel } = this.props;
      onUpdateTransformScript(selectedNodeModel.key, selectedInputModel.name, transformScript, testDataScript);
    } else if (errors && errors.length > 0) {
      this.setState({
        editInputTransformDialogErrors: errors,
      });
    }
  };

  handleDeleteTransformScript = () => {
    showConfirmationDialog('Are you sure you\'d like to remove the data transformation script?', (confirmation) => {
      if (confirmation) {
        const { onUpdateTransformScript, selectedNodeModel, selectedInputModel } = this.props;
        if (selectedNodeModel && selectedInputModel) {
          onUpdateTransformScript(selectedNodeModel.key, selectedInputModel.name);
        }
      }
    });
  };

  render () {
    const {
      classes,
      parentNodeModel,
      selectedNodeModel,
      selectedInputModel,
      parentOutputModel
    } = this.props;
    const {
      isEditInputTransformDialogOpen,
      outputSampleObjectText,
      inputSampleObjectText,
      editInputTransformDialogErrors,
      editInputTransformDialogOutput,
      editInputTransformDialogTestDataScript,
      editInputTransformDialogTransformationScript,
      transformationScript
    } = this.state;
    if (parentNodeModel && selectedNodeModel && selectedInputModel && parentOutputModel) {
      return (
        <div className={classes.root}>
          <SplitPane
            split="vertical"
            defaultSize={300}
            primary="first"
          >
            <div className={classes.outputSamplePane}>
              <div>
                {parentOutputModel && (
                  <PanelWithTitle title="Output endpoint sample object">
                    <ScriptView
                      propsSampleObjectText={outputSampleObjectText}
                    />
                  </PanelWithTitle>
                )}
              </div>
            </div>
            <SplitPane
              split="vertical"
              defaultSize={300}
              primary="second"
            >
              <div className={classes.transformFunctionPane}>
                {transformationScript && (
                  <div className={classes.transformEditButton}>
                    <ToolbarButton
                      iconType="Edit"
                      tooltip="Edit transform script"
                      switchedOn={true}
                      onClick={this.handleOpenEditInputTransformDialog}
                    />
                  </div>
                )}
                {transformationScript && (
                  <div className={classes.transformDeleteButton}>
                    <ToolbarButton
                      iconType="Delete"
                      iconColor="#ff8a80"
                      tooltip="Delete transform script"
                      switchedOn={true}
                      onClick={this.handleDeleteTransformScript}
                    />
                  </div>
                )}
                <PanelWithTitle title="Transformation script">
                  {transformationScript
                    ? (
                      <ScriptView
                        propsSampleObjectText={transformationScript}
                      />
                    )
                    : (
                      <div className={classes.rootEmpty}>
                        <Typography variant="body2" align="center" gutterBottom={true}>
                           In the selected connection: the data from the output endpoint is passed to the input endpoint as is.
                        </Typography>
                        <IconButton
                          title="Create a data transformation script"
                          onClick={this.handleOpenEditInputTransformDialog}
                        >
                          <FastForward fontSize="large" />
                        </IconButton>
                        <Typography variant="body2" align="center">
                          If you want to transform the data, please create the data transformation script by click on the icon above.
                        </Typography>
                      </div>
                    )
                  }
                </PanelWithTitle>
              </div>
              <div className={classes.inputSamplePane}>
                <div>
                  {selectedInputModel && (
                    <PanelWithTitle title="Input endpoint sample object">
                      <ScriptView
                        propsSampleObjectText={inputSampleObjectText}
                      />
                    </PanelWithTitle>
                  )}
                </div>
              </div>
            </SplitPane>
          </SplitPane>
          <EditInputTransformDialog
            title={
              parentNodeModel && selectedNodeModel
                ? (
                  `${parentNodeModel.props.searchName}.${parentOutputModel.name} --> ${selectedNodeModel.props.searchName}.${selectedInputModel.name}`
                )
                : ''
            }
            errors={editInputTransformDialogErrors}
            output={editInputTransformDialogOutput}
            testDataScript={editInputTransformDialogTestDataScript}
            transformScript={editInputTransformDialogTransformationScript}
            outputSampleScript={outputSampleObjectText}
            inputSampleScript={inputSampleObjectText}
            onSubmit={this.handleSubmitEditInputTransformDialog}
            onTest={this.handleTestEditInputTransformDialog}
            onClose={this.handleCloseEditInputTransformDialog}
            isOpen={isEditInputTransformDialogOpen}
          />
        </div>
      );
    }
    return (
      <div className={classes.rootEmpty}>
        <Typography variant="body2" align="center">
          Connect any output endpoint of the exiting elements in the flow to the input endpoint of the selected element
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(FlowInputTransformEditor);
