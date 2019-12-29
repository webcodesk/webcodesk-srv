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
import Typography from '@material-ui/core/Typography';
import ScriptView from './ScriptView';
import FilterTextField from './FilterTextField';
import ToolbarButton from './ToolbarButton';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '38px',
    overflow: 'hidden',
    borderBottom: '1px solid #cdcdcd',
  },
  topBarContainer: {
    padding: '3px 16px 3px 0',
  },
  content: {
    position: 'absolute',
    top: '39px',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  titleTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  subtitleText: {
    whiteSpace: 'nowrap',
    color: '#7d7d7d',
  },
  section: {
    marginBottom: '10px',
    borderTop: '2px solid #dddddd',
    overflow: 'hidden',
    height: '147px',
  },
  sectionExpanded: {
    marginBottom: '10px',
    borderTop: '2px solid #dddddd',
    overflow: 'hidden',
  },
  scriptViewWrapper: {
    padding: '10px',
  },
  scriptTitleBar: {
    backgroundColor: '#f5f5f5',
    padding: '5px 10px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-start',
  }
});

class PanelWithScriptList extends React.Component {
  static propTypes = {
    scriptList: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      scriptText: PropTypes.string,
    })),
    onUseScript: PropTypes.func,
  };

  static defaultProps = {
    scriptList: [],
    onUseScript: () => {
      console.info('PanelWithScriptList.onUseScript is not set');
    },
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      expandedById: {},
      filterText: '',
    };
  }

  handleToggleExpandSection = (id) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const expandedById = { ...this.state.expandedById };
    if (expandedById[id]) {
      delete expandedById[id];
    } else {
      expandedById[id] = true;
    }
    this.setState({
      expandedById,
    });
  };

  handleFilter = (text) => {
    this.setState({
      filterText: text,
    });
  };

  handleUseScript = (scriptText, testScriptText) => e => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onUseScript({scriptText, testScriptText});
  };

  createListElement = (
    key,
    id,
    connectedToName,
    connectedToOutput,
    elementName,
    inputName,
    flowName,
    scriptText,
    testScriptText,
    expandedById,
    classes
  ) => {
    return (
      <div
        key={key}
        className={expandedById[id] ? classes.sectionExpanded : classes.section}
      >
        <div className={classes.scriptTitleBar}>
          <div className={classes.titleContainer}>
            <div className={classes.titleTextContainer}>
              <Typography variant="body2" className={classes.titleText}>
                {connectedToName}
                &nbsp;
                <span className={classes.subtitleText}>({connectedToOutput})</span>
                &nbsp;&nbsp;
                <span className={classes.subtitleText}>&gt;&gt;</span>
                &nbsp;&nbsp;
                {elementName}
                &nbsp;
                <span className={classes.subtitleText}>({inputName})</span>
              </Typography>
            </div>
            <div className={classes.titleTextContainer}>
              <Typography variant="caption" className={classes.subtitleText}>
                {flowName}
              </Typography>
              <ToolbarButton
                title="Use script"
                primary={true}
                tooltip="Paste test and transformation scripts into the editor"
                onClick={this.handleUseScript(scriptText, testScriptText)}
              />
              {expandedById[id]
                ? (
                  <ToolbarButton
                    iconType="ExpandLess"
                    primary={true}
                    tooltip="Collapse"
                    onClick={this.handleToggleExpandSection(id)}
                  />
                )
                : (
                  <ToolbarButton
                    iconType="ExpandMore"
                    primary={true}
                    tooltip="Expand"
                    onClick={this.handleToggleExpandSection(id)}
                  />
                )
              }
            </div>
          </div>
        </div>
        <div className={classes.scriptViewWrapper}>
          <ScriptView
            propsSampleObjectText={scriptText}
          />
        </div>
      </div>
    );
  };

  render () {
    const { classes, scriptList } = this.props;
    const { expandedById, filterText } = this.state;
    const scriptListElements = [];
    if (scriptList && scriptList.length > 0) {
      for (let i = 0; i < scriptList.length; i++) {
        const {
          id,
          connectedToName,
          connectedToOutput,
          elementName,
          inputName,
          flowName,
          scriptText,
          testScriptText
        } = scriptList[i];
        if (filterText) {
          if (scriptText && scriptText.indexOf(filterText) >= 0) {
            scriptListElements.push(
              this.createListElement(
                `wrapper${i}`,
                id,
                connectedToName,
                connectedToOutput,
                elementName,
                inputName,
                flowName,
                scriptText,
                testScriptText,
                expandedById,
                classes
              )
            );
          }
        } else {
          scriptListElements.push(
            this.createListElement(
              `wrapper${i}`,
              id,
              connectedToName,
              connectedToOutput,
              elementName,
              inputName,
              flowName,
              scriptText,
              testScriptText,
              expandedById,
              classes
            )
          );
        }
      }
    }
    return (
      <div className={classes.root}>
        <div className={classes.topBar}>
          <div className={classes.topBarContainer}>
            <FilterTextField placeholder="Filter by text in script" onChange={this.handleFilter}/>
          </div>
        </div>
        <div className={classes.content}>
          {scriptListElements}
          <div className={classes.section} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PanelWithScriptList);
