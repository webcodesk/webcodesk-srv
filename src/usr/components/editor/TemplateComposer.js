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

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import uniqueId from 'lodash/uniqueId';
import debounce from 'lodash/debounce';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SplitPane from '../splitPane';
import constants from '../../../commons/constants';
import PageComposerManager from '../../core/pageComposer/PageComposerManager';
import { CommonToolbar, CommonToolbarDivider, CommonTab, CommonTabs } from '../commons/Commons.parts';
import IFrame from './IFrame';
import PageTree from './PageTree';
import ToolbarButton from '../commons/ToolbarButton';
import ComponentPropsTree from './ComponentPropsTree';
import globalStore from '../../core/config/globalStore';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  leftPane: {
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
    overflow: 'auto',
  },
  topPane: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '39px',
    right: 0,
    minWidth: '1100px'
  },
  editorPane: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    overflow: 'auto',
  }
});

class TemplateComposer extends React.Component {
  static propTypes = {
    dataId: PropTypes.string,
    isVisible: PropTypes.bool,
    data: PropTypes.object,
    isDraggingItem: PropTypes.bool,
    draggedItem: PropTypes.object,
    updateHistory: PropTypes.array,
    clipboardItems: PropTypes.array,
    serverPort: PropTypes.number,
    onUpdate: PropTypes.func,
    onSearchRequest: PropTypes.func,
    onErrorClick: PropTypes.func,
    onUndo: PropTypes.func,
    onOpenComponent: PropTypes.func,
    onPushToClipboard: PropTypes.func,
  };

  static defaultProps = {
    dataId: '',
    isVisible: true,
    data: null,
    isDraggingItem: false,
    draggedItem: null,
    updateHistory: [],
    clipboardItems: [],
    serverPort: -1,
    onUpdate: () => {
      console.info('TemplateComposer.onUpdate is not set');
    },
    onSearchRequest: () => {
      console.info('TemplateComposer.onSearchRequest is not set');
    },
    onErrorClick: () => {
      console.info('TemplateComposer.onErrorClick is not set');
    },
    onUndo: () => {
      console.info('TemplateComposer.onUndo is not set');
    },
    onOpenComponent: () => {
      console.info('TemplateComposer.onOpenComponent is not set');
    },
    onPushToClipboard: () => {
      console.info('TemplateComposer.onPushToClipboard is not set');
    },
  };

  constructor (props) {
    super(props);
    this.iFrameRef = React.createRef();
    this.iframeId = uniqueId('iframe');
    const { data } = this.props;
    const componentsTree = data ? data.componentsTree : {};
    this.pageComposerManager = new PageComposerManager(componentsTree, {});
    this.state = {
      iFrameReadyCounter: 0,
      sendMessageCounter: 0,
      sendUpdateCounter: 0,
      recentUpdateHistory: [],
      selectedComponentModel: null,
      localComponentsTree: null,
      showTreeView: this.getViewFlag('showTreeView', false),
      showPropertyEditor: this.getViewFlag('showPropertyEditor', true),
      showPanelCover: false,
      showIframeDropPanelCover: false,
      iFrameWidthIndex: this.getViewFlag('iFrameWidthIndex', 0),
      structureTabActiveIndex: 0,
      isPreviewMode: false,
      treeViewSplitterSize: this.getViewFlag('treeViewSplitterSize', 350),
      propertyEditorSplitterSize: this.getViewFlag('propertyEditorSplitterSize', 250),
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const {
      iFrameReadyCounter,
      localComponentsTree,
      sendMessageCounter,
      sendUpdateCounter,
      selectedComponentModel,
      isPreviewMode
    } = this.state;
    const { data } = this.props;
    if (iFrameReadyCounter > 0 && iFrameReadyCounter !== prevState.iFrameReadyCounter) {
      // send message to iframe only when it is ready
      this.updateLocalState(false);
      if (this.iFrameRef.current) {
        this.iFrameRef.current.setFocus();
      }
    } else if (data !== prevProps.data && sendUpdateCounter === 0) {
      const componentsTree = data ? data.componentsTree : {};
      if (
        componentsTree
        && !isEqual(localComponentsTree, componentsTree)
      ) {
        delete this.pageComposerManager;
        this.pageComposerManager = new PageComposerManager(componentsTree, {});
        if (selectedComponentModel) {
          this.pageComposerManager.selectCell(selectedComponentModel.key);
        }
        this.updateLocalState(false);
      }
    } else if (sendMessageCounter !== prevState.sendMessageCounter && localComponentsTree) {
      this.handleSendMessage({
        type: constants.WEBCODESK_MESSAGE_UPDATE_PAGE_COMPONENTS_TREE,
        payload: localComponentsTree
      });
    }
    const { isDraggingItem, draggedItem, isVisible } = this.props;
    if (isVisible && !isPreviewMode) {
      if (isDraggingItem && !prevProps.isDraggingItem && draggedItem) {
        if (
          draggedItem.isComponent
          || draggedItem.isComponentInstance
          || draggedItem.isClipboardItem
          || draggedItem.isTemplate
        ) {
          this.setState({
            showIframeDropPanelCover: true,
          });
          this.handleSendMessage({
            type: constants.WEBCODESK_MESSAGE_COMPONENT_ITEM_DRAG_START,
            payload: draggedItem.draggingModel,
          });
        }
      } else if (!isDraggingItem && prevProps.isDraggingItem) {
        this.setState({
          showIframeDropPanelCover: false,
        });
        this.handleSendMessage({
          type: constants.WEBCODESK_MESSAGE_COMPONENT_ITEM_DRAG_END
        });
      }
    }
    if (prevProps.isVisible !== isVisible) {
      if (!isVisible) {
        // we save all recent changes if there were some
        if (sendUpdateCounter !== 0) {
          this.sendUpdate();
        }
      }
    }
  }

  updateLocalState = (doSendUpdate) => {
    this.setState((state) => {
      const {
        sendMessageCounter,
        sendUpdateCounter,
        recentUpdateHistory,
        localComponentsTree,
      } = state;
      const newState = {
        localComponentsTree: this.pageComposerManager.getModel(),
        sendMessageCounter: sendMessageCounter + 1,
        selectedComponentModel: this.pageComposerManager.getSelectedNode(),
      };
      if (doSendUpdate) {
        if (sendMessageCounter > 0) {
          newState.recentUpdateHistory = [
            ...recentUpdateHistory,
            {
              componentsTree: localComponentsTree,
            }
          ];
        }
        newState.sendUpdateCounter = sendUpdateCounter + 1;
      }
      return newState;
    });
  };

  undoUpdateLocalState = () => {
    this.setState((state) => {
      const {
        sendMessageCounter,
        sendUpdateCounter,
        recentUpdateHistory,
      } = state;
      const newRecentUpdateHistory = [...recentUpdateHistory];
      const lastRecentChanges = newRecentUpdateHistory.pop();
      if (lastRecentChanges) {
        delete this.pageComposerManager;
        this.pageComposerManager =
          new PageComposerManager(
            lastRecentChanges.componentsTree,
            {}
          );
        return {
          localComponentsTree: this.pageComposerManager.getModel(),
          selectedComponentModel: this.pageComposerManager.getSelectedNode(),
          sendMessageCounter: sendMessageCounter + 1,
          sendUpdateCounter: sendUpdateCounter - 1,
          recentUpdateHistory: newRecentUpdateHistory,
        };
      }
      return {};
    });
    if (this.iFrameRef.current) {
      this.iFrameRef.current.setFocus();
    }
  };

  sendUpdate = () => {
    this.setState({
      sendUpdateCounter: 0,
      recentUpdateHistory: [],
    });
    const { onUpdate } = this.props;
    onUpdate({
      componentsTree: this.pageComposerManager.getSerializableModel(),
    });
    // if (this.iFrameRef.current) {
    //   this.iFrameRef.current.setFocus();
    // }
  };

  storeViewFlag = (flagName, flagValue) => {
    const { dataId } = this.props;
    if (dataId) {
      const recordViewFlags = globalStore.get(constants.STORAGE_RECORD_TEMPLATE_COMPOSER_FLAGS) || {};
      const viewFlags = recordViewFlags[dataId] || {};
      viewFlags[flagName] = flagValue;
      recordViewFlags[dataId] = viewFlags;
      globalStore.set(constants.STORAGE_RECORD_TEMPLATE_COMPOSER_FLAGS, recordViewFlags, true);
    }
  };

  getViewFlag = (flagName, flagDefaultValue) => {
    const { dataId } = this.props;
    if (dataId) {
      const recordViewFlags = globalStore.get(constants.STORAGE_RECORD_TEMPLATE_COMPOSER_FLAGS) || {};
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
      this.iFrameRef.current.sendMessage({...message, sourceId: this.iframeId});
    }
  };

  handleReload = () => {
    if (this.iFrameRef.current) {
      this.iFrameRef.current.reloadPage();
      this.iFrameRef.current.setFocus();
    }
  };

  handleIFrameMessage = (message) => {
    if (message) {
      const { type, payload, sourceId } = message;
      if (sourceId === this.iframeId) {
        if (type === constants.FRAMEWORK_MESSAGE_PAGE_CELL_WAS_SELECTED) {
          const { targetKey } = payload;
          this.pageComposerManager.selectCell(targetKey);
          if (this.iFrameRef.current) {
            this.iFrameRef.current.setFocus();
          }
          this.updateLocalState();
        } else if (type === constants.FRAMEWORK_MESSAGE_COMPONENT_ITEM_WAS_DROPPED) {
          // source is taken from the dragItem.draggingModel when we start dragging
          // now it is back from the iFrame inside the message
          const { draggedItem } = this.props;
          const { destination } = payload;
          if (destination && destination.key) {
            const newKey = this.pageComposerManager.placeNewComponent(destination.key, draggedItem);
            this.pageComposerManager.selectCell(newKey);
            this.updateLocalState(true);
          }
        } else if (type === constants.FRAMEWORK_MESSAGE_CONTEXT_MENU_CLICKED) {
          // const { targetKey } = payload;
          // console.info('Context menu for the key: ', targetKey);
        } else if (type === constants.FRAMEWORK_MESSAGE_UNDO) {
          this.undoUpdateLocalState();
        } else if (type === constants.FRAMEWORK_MESSAGE_COPY) {
          this.handleCopyComponentInstance();
        } else if (type === constants.FRAMEWORK_MESSAGE_CUT) {
          this.handleCutComponentInstance();
        } else if (type === constants.FRAMEWORK_MESSAGE_PASTE) {
          this.handlePasteComponentInstance();
        } else if (type === constants.FRAMEWORK_MESSAGE_SAVE) {
          this.sendUpdate();
        } else if (type === constants.FRAMEWORK_MESSAGE_RELOAD) {
          this.handleReload();
        } else if (type === constants.FRAMEWORK_MESSAGE_DELETE) {
          this.handleDeleteComponentInstance();
        }
      }
    }
  };

  handleSelectComponent = (key) => {
    this.pageComposerManager.selectCell(key);
    this.updateLocalState();
  };

  handlePageTreeItemDrop = (data) => {
    const { draggedItem } = this.props;
    const { destination } = data;
    if (destination && destination.key) {
      // source is taken from the dragItem.draggingModel when we start dragging
      // now it is back from the iFrame inside the message
      const newKey = this.pageComposerManager.placeNewComponent(destination.key, draggedItem);
      this.pageComposerManager.selectCell(newKey);
      this.updateLocalState(true);
    }
  };

  handleRenameComponentInstance = (newComponentInstance) => {
    if (newComponentInstance) {
      const { selectedComponentModel } = this.state;
      if (selectedComponentModel) {
        this.pageComposerManager.renameComponentInstance(selectedComponentModel.key, newComponentInstance);
        this.updateLocalState(true);
      }
    }
  };

  handleUpdateComponentProperty = (newComponentPropertyModel) => {
    if (newComponentPropertyModel) {
      this.pageComposerManager.updateComponentProperty(newComponentPropertyModel);
      const { selectedComponentModel } = this.state;
      if (selectedComponentModel) {
        this.pageComposerManager.selectCell(selectedComponentModel.key);
      }
      this.updateLocalState(true);
    }
  };

  handleIncreaseComponentPropertyArray = (propertyKey) => {
    this.pageComposerManager.increaseComponentPropertyArray(propertyKey);
    this.updateLocalState(true);
  };

  handleDeleteComponentProperty = (propertyKey) => {
    this.pageComposerManager.deleteComponentProperty(propertyKey);
    this.updateLocalState(true);
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

  handleDuplicateComponentPropertyArrayItem = (propertyKey, groupPropertyKey, itemIndex) => {
    this.pageComposerManager.duplicateComponentPropertyArrayItem(propertyKey, groupPropertyKey, itemIndex);
    this.updateLocalState(true);
  };

  handleDeleteComponentInstance = () => {
    const { selectedComponentModel } = this.state;
    if (selectedComponentModel) {
      // we have to send message to clear the page selections before we delete
      this.handleSendMessage({
        type: constants.WEBCODESK_MESSAGE_DELETE_PAGE_COMPONENT,
      });
      this.pageComposerManager.deleteComponentInstance(selectedComponentModel.key);
      this.updateLocalState(true);
      if (this.iFrameRef.current) {
        this.iFrameRef.current.setFocus();
      }
    }
  };

  handleCopyComponentInstance = () => {
    const { selectedComponentModel } = this.state;
    if (selectedComponentModel) {
      this.props.onPushToClipboard(
        this.pageComposerManager.getSerializableModel(selectedComponentModel.key)
      );
      if (this.iFrameRef.current) {
        this.iFrameRef.current.setFocus();
      }
    }
  };

  handleCutComponentInstance = () => {
    const { selectedComponentModel } = this.state;
    if (selectedComponentModel) {
      this.props.onPushToClipboard(
        this.pageComposerManager.getSerializableModel(selectedComponentModel.key)
      );
      this.handleDeleteComponentInstance();
    }
  };

  handlePasteComponentInstance = () => {
    const { clipboardItems } = this.props;
    const { selectedComponentModel } = this.state;
    if (selectedComponentModel && clipboardItems && clipboardItems.length > 0) {
      const newKey =
        this.pageComposerManager.placeNewComponent(selectedComponentModel.key, clipboardItems[0]);
      this.pageComposerManager.selectCell(newKey);
      this.updateLocalState(true);
      if (this.iFrameRef.current) {
        this.iFrameRef.current.setFocus();
      }
    }
  };

  handleToggleTreeView = () => {
    this.storeViewFlag('showTreeView', !this.state.showTreeView);
    this.setState({
      showTreeView: !this.state.showTreeView,
    });
  };

  handleTogglePropertyEditor = () => {
    this.storeViewFlag('showPropertyEditor', !this.state.showPropertyEditor);
    this.setState({
      showPropertyEditor: !this.state.showPropertyEditor,
    });
  };

  handleSplitterOnDragStarted = () => {
    this.setState({
      showPanelCover: true,
    });
  };

  handleSplitterOnDragFinished = (splitterName) => (newSplitterSize) => {
    this.storeViewFlag(splitterName, newSplitterSize);
    this.setState({
      showPanelCover: false,
    });
  };

  handleToggleWidth = (widthIndex) => () => {
    this.storeViewFlag('iFrameWidthIndex', widthIndex);
    this.setState({
      iFrameWidthIndex: widthIndex,
    });
  };

  handleSearchRequest = (text) => () => {
    this.props.onSearchRequest(text);
  };

  handleErrorClick = (messages) => {
    this.props.onErrorClick(messages);
  };

  handleUndo = () => {
    this.props.onUndo();
  };

  handleChangeStructureTab = (event, value) => {
    this.setState({
      structureTabActiveIndex: value,
    });
  };

  handleOpenComponent = () => {
    const { selectedComponentModel } = this.state;
    if (selectedComponentModel) {
      const {props} = selectedComponentModel;
      if (props) {
        this.props.onOpenComponent(props.componentName);
      }
    }
  };

  debouncedSendMessage = debounce(newMousePos => {
    const iframePos = this.iFrameRef.current.getOffset();
    const newPos = {
      left: newMousePos.x - iframePos.left,
      top: newMousePos.y - iframePos.top,
    };
    this.handleSendMessage({
      type: constants.WEBCODESK_MESSAGE_COMPONENT_ITEM_DRAG_MOVE,
      payload: newPos
    });
  }, 20);

  handleDragOver = (e) => {
    e.preventDefault();
    this.debouncedSendMessage({x: e.pageX, y: e.pageY});
  };

  handleTogglePreviewMode = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.setState({
      isPreviewMode: !this.state.isPreviewMode
    });
  };

  render () {
    if (!this.pageComposerManager) {
      return (
        <h1>Empty template components tree</h1>
      );
    }
    const {
      selectedComponentModel,
      showTreeView,
      showPropertyEditor,
      showPanelCover,
      showIframeDropPanelCover,
      localComponentsTree,
      recentUpdateHistory,
      iFrameWidthIndex,
      structureTabActiveIndex,
      isPreviewMode,
      treeViewSplitterSize,
      propertyEditorSplitterSize,
    } = this.state;
    const {
      classes,
      draggedItem,
      isDraggingItem,
      updateHistory,
      serverPort,
      data,
      clipboardItems
    } = this.props;
    let hasSelectedComponentErrors = false;
    if (selectedComponentModel) {
      const {props} = selectedComponentModel;
      if (props && props.errors) {
        hasSelectedComponentErrors = !isEmpty(props.errors);
      }
    }
    return (
        <div className={classes.root}>
          <div className={classes.topPane}>
            <CommonToolbar disableGutters={true} dense="true">
              <ToolbarButton
                switchedOn={showTreeView}
                onClick={this.handleToggleTreeView}
                title="Structure"
                iconType="FormatAlignRight"
                tooltip={showTreeView
                  ? 'Close page tree structure'
                  : 'Open page tree structure'
                }
                error={data.hasErrors}
              />
              <ToolbarButton
                switchedOn={showPropertyEditor}
                onClick={this.handleTogglePropertyEditor}
                title="Properties"
                iconType="Edit"
                tooltip={showPropertyEditor
                  ? 'Close component\'s properties editor'
                  : 'Open component\'s properties editor'
                }
                error={hasSelectedComponentErrors}
              />
              <CommonToolbarDivider />
              <ToolbarButton
                iconType="CopyToClipboard"
                disabled={!selectedComponentModel}
                onClick={this.handleCopyComponentInstance}
                tooltip="Copy the selected element into the clipboard"
              />
              <ToolbarButton
                iconType="CutToClipboard"
                disabled={!selectedComponentModel}
                onClick={this.handleCutComponentInstance}
                tooltip="Cut the selected element into the clipboard"
              />
              <ToolbarButton
                iconType="PasteFromClipboard"
                disabled={!selectedComponentModel || !clipboardItems || clipboardItems.length === 0}
                onClick={this.handlePasteComponentInstance}
                tooltip="Replace the selected element with the last clipboard item"
              />
              <ToolbarButton
                iconType="Undo"
                disabled={recentUpdateHistory.length === 0}
                onClick={this.undoUpdateLocalState}
                tooltip="Undo the last recent change on the page"
              />
              <ToolbarButton
                iconType="Delete"
                iconColor="#E53935"
                disabled={!selectedComponentModel}
                onClick={this.handleDeleteComponentInstance}
                tooltip="Remove the selected component instance from the page"
              />
              <CommonToolbarDivider />
              <ToolbarButton
                iconType="Cached"
                disabled={!updateHistory || updateHistory.length === 0}
                onClick={this.handleUndo}
                title="Last Saved"
                tooltip="Restore the last saving"
              />
              <ToolbarButton
                iconType="Save"
                iconColor="#4caf50"
                onClick={this.sendUpdate}
                title="Save"
                switchedOn={recentUpdateHistory.length > 0}
                disabled={recentUpdateHistory.length === 0}
                tooltip="Save all recent changes"
              />
              <ToolbarButton
                iconType="Refresh"
                title="Reload"
                onClick={this.handleReload}
                tooltip="Reload the entire page"
              />
              <CommonToolbarDivider />
              <ToolbarButton
                iconType="SlowMotionVideo"
                title="Preview"
                switchedOn={isPreviewMode}
                onClick={this.handleTogglePreviewMode}
                tooltip={isPreviewMode
                  ? "Switch to edit mode"
                  : "Switch to live preview mode"
                }
              />
              <CommonToolbarDivider />
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
          </div>
          <div className={classes.centralPane}>
            <SplitPane
              split="vertical"
              defaultSize={treeViewSplitterSize}
              onDragStarted={this.handleSplitterOnDragStarted}
              onDragFinished={this.handleSplitterOnDragFinished('treeViewSplitterSize')}
              pane1Style={{display: showTreeView ? 'block' : 'none'}}
              resizerStyle={{display: showTreeView ? 'block' : 'none'}}
            >
              <div className={classes.leftPane}>
                <CommonTabs
                  value={structureTabActiveIndex}
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth={true}
                  onChange={this.handleChangeStructureTab}
                >
                  <CommonTab label="Structure"/>
                </CommonTabs>
                {structureTabActiveIndex === 0 && (
                  <PageTree
                    componentsTree={localComponentsTree}
                    onItemClick={this.handleSelectComponent}
                    onItemDrop={this.handlePageTreeItemDrop}
                    onItemErrorClick={this.handleErrorClick}
                    draggedItem={
                      draggedItem && (
                        draggedItem.isComponent
                        || draggedItem.isComponentInstance
                        || draggedItem.isClipboardItem
                        || draggedItem.isTemplate
                      )
                        ? draggedItem
                        : null
                    }
                    isDraggingItem={isDraggingItem}
                  />
                )}
              </div>
              <SplitPane
                split="vertical"
                primary="second"
                defaultSize={propertyEditorSplitterSize}
                onDragStarted={this.handleSplitterOnDragStarted}
                onDragFinished={this.handleSplitterOnDragFinished('propertyEditorSplitterSize')}
                pane2Style={{display: showPropertyEditor ? 'block' : 'none'}}
                resizerStyle={{display: showPropertyEditor ? 'block' : 'none'}}
              >
                <div className={classes.root}>
                  {showPanelCover && (
                    <div className={classes.root} style={{zIndex: 10}} />
                  )}
                  {showIframeDropPanelCover && (
                    <div
                      className={classes.root}
                      style={{zIndex: 10}}
                      onDragOver={this.handleDragOver}
                    />
                  )}
                  {serverPort > 0 && (
                    <IFrame
                      ref={this.iFrameRef}
                      width={constants.MEDIA_WIDTHS[iFrameWidthIndex].width}
                      url={isPreviewMode
                        ? `http://localhost:${serverPort}/webcodesk__component_view`
                        : `http://localhost:${serverPort}/webcodesk__page_composer?iframeId=${this.iframeId}`
                      }
                      onIFrameReady={this.handleIFrameReady}
                      onIFrameMessage={this.handleIFrameMessage}
                    />
                  )}
                </div>
                <div className={classes.editorPane}>
                  <ComponentPropsTree
                    componentModel={selectedComponentModel}
                    onUpdateComponentPropertyModel={this.handleUpdateComponentProperty}
                    onIncreaseComponentPropertyArray={this.handleIncreaseComponentPropertyArray}
                    onDeleteComponentProperty={this.handleDeleteComponentProperty}
                    onRenameComponentInstance={this.handleRenameComponentInstance}
                    onErrorClick={this.handleErrorClick}
                    onOpenComponent={this.handleOpenComponent}
                    onUpdateComponentPropertyArrayOrder={this.handleUpdateComponentPropertyArrayOrder}
                    onDuplicateComponentPropertyArrayItem={this.handleDuplicateComponentPropertyArrayItem}
                    onSelectComponent={this.handleSelectComponent}
                  />
                </div>
              </SplitPane>
            </SplitPane>
          </div>
        </div>
    );
  }
}

export default withStyles(styles)(TemplateComposer);
