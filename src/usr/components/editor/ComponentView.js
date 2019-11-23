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

import isEqual from 'lodash/isEqual';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SplitPane from '../splitPane';
import constants from '../../../commons/constants';
import globalStore from '../../core/config/globalStore';
import { CommonToolbar, CommonToolbarDivider, CommonTab, CommonTabs } from '../commons/Commons.parts';
import IFrame from './IFrame';
import ToolbarButton from '../commons/ToolbarButton';
import EventsLogViewer from './EventsLogViewer';
import SourceCodeEditor from '../commons/SourceCodeEditor';
import MarkdownView from '../commons/MarkdownView';
import PageComposerManager from '../../core/pageComposer/PageComposerManager';
import ComponentPropsTree from './ComponentPropsTree';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  editorPane: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    overflow: 'auto',
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
  leftPane: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  tabContentPane: {
    position: 'absolute',
    top: '32px',
    bottom: 0,
    right: 0,
    left: 0,
    overflow: 'auto',
  },
});

class ComponentView extends React.Component {
  static propTypes = {
    dataId: PropTypes.string,
    data: PropTypes.object,
    serverPort: PropTypes.number,
    isVisible: PropTypes.bool,
    onSaveChanges: PropTypes.func,
    onSaveAsTemplate: PropTypes.func,
  };

  static defaultProps = {
    dataId: '',
    data: {},
    serverPort: -1,
    // sourceCode: '',
    isVisible: true,
    onSaveChanges: () => {
      console.info('ComponentView.onSaveChanges is not set');
    },
    onSaveAsTemplate: () => {
      console.info('ComponentView.onSaveAsTemplate is not set');
    },
  };

  constructor (props) {
    super(props);
    this.iFrameRef = React.createRef();
    const { data } = this.props;
    const componentsTree = data ? data.componentViewModel : {};
    this.pageComposerManager = new PageComposerManager(componentsTree, {});
    this.state = {
      activeListItemIndex: 0,
      iFrameReadyCounter: 0,
      sendMessageCounter: 0,
      showPanelCover: false,
      showPropertyEditor: this.getViewFlag('showPropertyEditor', true),
      showInfoView: this.getViewFlag('showInfoView', true),
      infoTabActiveIndex: this.getViewFlag('infoTabActiveIndex', 0),
      iFrameWidthIndex: this.getViewFlag('iFrameWidthIndex', 0),
      lastDebugMsg: null,
      isSourceCodeOpen: false,
      localComponentViewModel: null,
      localComponentsTree: this.pageComposerManager.getModel(),
      localSourceCode: '',
      markdownContent: data ? data.readmeText : '',
      sourceCodeUpdateCounter: 0,
      recentUpdateHistory: [],
      actionsLogViewSplitterSize: this.getViewFlag('actionsLogViewSplitter', 350),
      storiesViewSplitterSize: this.getViewFlag('storiesViewSplitterSize', 250)
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { data, isVisible } = this.props;
    const {
      iFrameReadyCounter,
      sourceCodeUpdateCounter,
      sendMessageCounter,
      localComponentsTree,
      localComponentViewModel,
      isSourceCodeOpen
    } = this.state;
    if (prevProps.isVisible !== isVisible) {
      if (!isVisible && sourceCodeUpdateCounter > 0) {
        this.handleSaveChanges();
      }
    }
    if (iFrameReadyCounter > 0 && iFrameReadyCounter !== prevState.iFrameReadyCounter) {
      this.updateLocalState();
    } else if (data && data !== prevProps.data) {
      if (sourceCodeUpdateCounter === 0) {
        data.sourceCode.then(sourceCodeData => {
          this.setState({
            localSourceCode: sourceCodeData,
          });
        });
      }
      this.setState({
        markdownContent: data.readmeText || '',
      });
      const componentViewModel = data.componentViewModel || {};
      if (!isEqual(localComponentViewModel, componentViewModel)) {
        delete this.pageComposerManager;
        this.pageComposerManager = new PageComposerManager(componentViewModel, {});
        this.updateLocalState();
      }
    } else if (sendMessageCounter !== prevState.sendMessageCounter) {
      this.handleSendMessage({
        type: constants.WEBCODESK_MESSAGE_UPDATE_PAGE_COMPONENTS_TREE,
        payload: localComponentsTree
      });
    } else if (data && !prevState.isSourceCodeOpen && isSourceCodeOpen) {
      data.sourceCode.then(sourceCodeData => {
        this.setState({
          localSourceCode: sourceCodeData,
        });
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { data, isVisible, serverPort } = this.props;
    const {
      iFrameReadyCounter,
      sendMessageCounter,
      showPanelCover,
      showPropertyEditor,
      showInfoView,
      infoTabActiveIndex,
      iFrameWidthIndex,
      lastDebugMsg,
      isSourceCodeOpen,
      sourceCodeUpdateCounter,
      localSourceCode,
      localComponentViewModel
    } = this.state;
    return iFrameReadyCounter !== nextState.iFrameReadyCounter
      || sendMessageCounter !== nextState.sendMessageCounter
      || showPanelCover !== nextState.showPanelCover
      || showPropertyEditor !== nextState.showPropertyEditor
      || showInfoView !== nextState.showInfoView
      || infoTabActiveIndex !== nextState.infoTabActiveIndex
      || iFrameWidthIndex !== nextState.iFrameWidthIndex
      || lastDebugMsg !== nextState.lastDebugMsg
      || isSourceCodeOpen !== nextState.isSourceCodeOpen
      || sourceCodeUpdateCounter !== nextState.sourceCodeUpdateCounter
      || localSourceCode !== nextState.localSourceCode
      || localComponentViewModel !== nextState.localComponentViewModel
      || data !== nextProps.data
      || serverPort !== nextProps.serverPort
      || isVisible !== nextProps.isVisible;
  }

  updateLocalState = () => {
    const {
      sendMessageCounter,
      recentUpdateHistory,
      localComponentsTree,
      localComponentViewModel
    } = this.state;
    const newRecentUpdateHistory =
      [
        ...recentUpdateHistory,
        {
          componentsTree: localComponentsTree,
          componentViewModel: localComponentViewModel,
        }
      ];
    const { data } = this.props;
    this.setState({
      sendMessageCounter: sendMessageCounter + 1,
      localComponentsTree: this.pageComposerManager.getModel(),
      localComponentViewModel: data ? data.componentViewModel : {},
      recentUpdateHistory: newRecentUpdateHistory,
    });
  };

  undoUpdateLocalState = () => {
    const {
      sendMessageCounter,
      recentUpdateHistory,
    } = this.state;
    const newRecentUpdateHistory = [...recentUpdateHistory];
    const lastRecentChanges = newRecentUpdateHistory.pop();
    if (lastRecentChanges) {
      delete this.pageComposerManager;
      this.pageComposerManager =
        new PageComposerManager(
          lastRecentChanges.componentsTree,
        );
      this.setState({
        sendMessageCounter: sendMessageCounter + 1,
        localComponentsTree: this.pageComposerManager.getModel(),
        localComponentViewModel: lastRecentChanges.componentViewModel,
        recentUpdateHistory: newRecentUpdateHistory,
      });
    }
  };

  storeViewFlag = (flagName, flagValue) => {
    const { dataId } = this.props;
     if (dataId) {
       const recordViewFlags = globalStore.get(constants.STORAGE_RECORD_COMPONENT_VIEW_FLAGS) || {};
       const viewFlags = recordViewFlags[dataId] || {};
       viewFlags[flagName] = flagValue;
       recordViewFlags[dataId] = viewFlags;
       globalStore.set(constants.STORAGE_RECORD_COMPONENT_VIEW_FLAGS, recordViewFlags, true);
    }
  };

  getViewFlag = (flagName, flagDefaultValue) => {
    const { dataId } = this.props;
    if (dataId) {
      const recordViewFlags = globalStore.get(constants.STORAGE_RECORD_COMPONENT_VIEW_FLAGS) || {};
      const viewFlags = recordViewFlags[dataId] || {};
      const viewFlag = viewFlags[flagName];
      return typeof viewFlag === 'undefined' ? flagDefaultValue : viewFlag;
    }
    return flagDefaultValue;
  };

  handleIFrameReady = () => {
    this.setState({
      iFrameReadyCounter: this.state.iFrameReadyCounter + 1,
    });
  };

  handleSendMessage = (message) => {
    if (this.iFrameRef.current && this.state.iFrameReadyCounter > 0) {
      this.iFrameRef.current.sendMessage(message);
    }
  };

  handleFrameworkMessage = (message) => {
    if (message) {
      const { type, payload } = message;
      if (type === constants.FRAMEWORK_MESSAGE_COMPONENT_EVENT) {
        this.setState({
          lastDebugMsg: payload,
        });
      }
    }
  };

  handleReload = () => {
    this.iFrameRef.current.reloadPage();
  };

  handleTogglePropsPanel = () => {
    this.storeViewFlag('showPropertyEditor', !this.state.showPropertyEditor);
    this.setState({
      showPropertyEditor: !this.state.showPropertyEditor,
    });
  };

  handleToggleInfoView = () => {
    this.storeViewFlag('showInfoView', !this.state.showInfoView);
    this.setState({
      showInfoView: !this.state.showInfoView,
    });
  };

  handleSplitterOnDragStarted = () => {
    this.setState({
      showPanelCover: true,
    });
  };

  handleSplitterOnDragFinished = (splitterName) =>  (newSplitterSize) => {
    this.storeViewFlag(splitterName, newSplitterSize);
    this.setState({
      showPanelCover: false,
    });
  };

  handleChangeInfoTab = (event, value) => {
    this.storeViewFlag('infoTabActiveIndex', value);
    this.setState({
      infoTabActiveIndex: value,
    });
  };

  handleToggleWidth = (widthIndex) => () => {
    this.storeViewFlag('iFrameWidthIndex', widthIndex);
    this.setState({
      iFrameWidthIndex: widthIndex,
    });
  };

  handleToggleSourceCode = () => {
    this.setState({
      isSourceCodeOpen: !this.state.isSourceCodeOpen,
    });
  };

  handleChangeSourceCode = ({script, hasErrors}) => {
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

  handleUpdateComponentProperty = (newComponentPropertyModel) => {
    if (newComponentPropertyModel) {
      this.pageComposerManager.updateComponentProperty(newComponentPropertyModel);
      this.updateLocalState();
    }
  };

  handleIncreaseComponentPropertyArray = (propertyKey) => {
    this.pageComposerManager.increaseComponentPropertyArray(propertyKey);
    this.updateLocalState();
  };

  handleDeleteComponentProperty = (propertyKey) => {
    this.pageComposerManager.deleteComponentProperty(propertyKey);
    this.updateLocalState();
  };

  handleUpdateComponentPropertyArrayOrder = (newComponentPropertyModel) => {
    if (newComponentPropertyModel) {
      this.pageComposerManager.updateComponentPropertyArrayOrder(newComponentPropertyModel);
      const { selectedComponentModel } = this.state;
      if (selectedComponentModel) {
        this.pageComposerManager.selectCell(selectedComponentModel.key);
      }
      this.updateLocalState(true);
    }
  };

  handleSaveAsTemplate = () => {
    this.props.onSaveAsTemplate(this.state.localComponentsTree);
  };

  render () {
    const { classes, serverPort } = this.props;
    const {
      showPropertyEditor,
      showInfoView,
      showPanelCover,
      infoTabActiveIndex,
      lastDebugMsg,
      isSourceCodeOpen,
      localSourceCode,
      markdownContent,
      sourceCodeUpdateCounter,
      localComponentsTree,
      recentUpdateHistory,
      actionsLogViewSplitterSize,
      storiesViewSplitterSize
    } = this.state;
    const { iFrameWidthIndex } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.topPane}>
          {!isSourceCodeOpen
            ? (
              <CommonToolbar disableGutters={true} dense="true">
                <ToolbarButton
                  iconType="LibraryBooks"
                  switchedOn={showInfoView}
                  onClick={this.handleToggleInfoView}
                  title="Readme"
                  tooltip={showInfoView
                    ? 'Close component readme and events log'
                    : 'Open component readme and events log'
                  }
                />
                <ToolbarButton
                  iconType="Edit"
                  switchedOn={showPropertyEditor}
                  onClick={this.handleTogglePropsPanel}
                  title="Properties"
                  tooltip={showPropertyEditor
                    ? 'Close component properties'
                    : 'Open component properties'
                  }
                />
                <CommonToolbarDivider/>
                <ToolbarButton
                  iconType="Undo"
                  title="Undo"
                  disabled={recentUpdateHistory.length === 0}
                  onClick={this.undoUpdateLocalState}
                  tooltip="Undo the last change of the property"
                />
                <CommonToolbarDivider/>
                <ToolbarButton
                  iconType="Edit"
                  title="Source Code"
                  onClick={this.handleToggleSourceCode}
                  tooltip="Switch to the source code editor"
                />
                <ToolbarButton
                  iconType="Refresh"
                  title="Reload"
                  onClick={this.handleReload}
                  tooltip="Reload the entire page"
                />
                <CommonToolbarDivider/>
                <ToolbarButton
                  iconType="Widgets"
                  title="Save Template"
                  onClick={this.handleSaveAsTemplate}
                  tooltip="Save the component with current settings as a template"
                />
                <CommonToolbarDivider/>
                <ToolbarButton
                  iconType={constants.MEDIA_WIDTHS[iFrameWidthIndex].iconType}
                  title={constants.MEDIA_WIDTHS[iFrameWidthIndex].label}
                  tooltip={constants.MEDIA_WIDTHS[iFrameWidthIndex].tooltip}
                  titleLengthLimit={200}
                  menuItems={constants.MEDIA_WIDTHS.map((mediaWidthItem, itemIndex) => {
                    return {
                      label: mediaWidthItem.label,
                      iconType: mediaWidthItem.iconType,
                      tooltip: mediaWidthItem.tooltip,
                      onClick: this.handleToggleWidth(itemIndex),
                    }
                  })}
                />
              </CommonToolbar>
            )
            : (
              <CommonToolbar disableGutters={true} dense="true">
                <ToolbarButton
                  iconType="ArrowBack"
                  title="Component View"
                  onClick={this.handleToggleSourceCode}
                  tooltip="Switch to the component view"
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
          }
        </div>
        <div className={classes.centralPane}>
          {!isSourceCodeOpen
            ? (
              <SplitPane
                key="storiesViewSplitter"
                split="vertical"
                primary="second"
                defaultSize={storiesViewSplitterSize}
                onDragStarted={this.handleSplitterOnDragStarted}
                onDragFinished={this.handleSplitterOnDragFinished('storiesViewSplitterSize')}
                pane2Style={{ display: showPropertyEditor ? 'block' : 'none' }}
                resizerStyle={{ display: showPropertyEditor ? 'block' : 'none' }}
              >
                <div className={classes.leftPane}>
                  <SplitPane
                    key="actionsLogViewSplitter"
                    split="horizontal"
                    defaultSize={actionsLogViewSplitterSize}
                    primary="second"
                    onDragStarted={this.handleSplitterOnDragStarted}
                    onDragFinished={this.handleSplitterOnDragFinished('actionsLogViewSplitterSize')}
                    pane2Style={{ display: showInfoView ? 'block' : 'none' }}
                    resizerStyle={{ display: showInfoView ? 'block' : 'none' }}
                  >
                    <div className={classes.root}>
                      {showPanelCover && (
                        <div className={classes.root} style={{ zIndex: 10 }}/>
                      )}
                      {serverPort > 0 && (
                        <IFrame
                          ref={this.iFrameRef}
                          width={constants.MEDIA_WIDTHS[iFrameWidthIndex].width}
                          url={`http://localhost:${serverPort}/webcodesk__component_view`}
                          onIFrameReady={this.handleIFrameReady}
                          onIFrameMessage={this.handleFrameworkMessage}
                        />
                      )}
                    </div>
                    <div className={classes.root}>
                      <CommonTabs
                        value={infoTabActiveIndex}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth={true}
                        onChange={this.handleChangeInfoTab}
                      >
                        <CommonTab label="Component Readme"/>
                        <CommonTab label="Events Log"/>
                      </CommonTabs>
                      {infoTabActiveIndex === 0 && (
                        <div className={classes.tabContentPane}>
                          <MarkdownView markdownContent={markdownContent} />
                        </div>
                      )}
                      {infoTabActiveIndex === 1 && (
                        <div className={classes.tabContentPane}>
                          <EventsLogViewer lastRecord={lastDebugMsg}/>
                        </div>
                      )}
                    </div>
                  </SplitPane>
                </div>
                <div className={classes.editorPane}>
                  <ComponentPropsTree
                    componentModel={localComponentsTree}
                    isSampleComponent={true}
                    onUpdateComponentPropertyModel={this.handleUpdateComponentProperty}
                    onIncreaseComponentPropertyArray={this.handleIncreaseComponentPropertyArray}
                    onDeleteComponentProperty={this.handleDeleteComponentProperty}
                    onUpdateComponentPropertyArrayOrder={this.handleUpdateComponentPropertyArrayOrder}
                  />
                </div>
              </SplitPane>
            )
            : (
              <SourceCodeEditor
                isVisible={true}
                data={{script: localSourceCode}}
                onChange={this.handleChangeSourceCode}
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ComponentView);
