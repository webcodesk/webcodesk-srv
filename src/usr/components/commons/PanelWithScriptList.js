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
  contentWrapper: {
    position: 'absolute',
    top: '41px',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
  },
  titleBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '5px',
    overflow: 'hidden',
    borderBottom: '1px solid #cdcdcd',
  },
  titleText: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
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
    alignItems: 'center',
  }
});

class PanelWithScriptList extends React.Component {
  static propTypes = {
    scriptList: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      scriptText: PropTypes.string,
    })),
  };

  static defaultProps = {
    scriptList: [],
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      expandedById: {}
    };
  }

  handleToggleExpandSection = (id) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const expandedById = {...this.state.expandedById};
    if (expandedById[id]) {
      delete expandedById[id];
    } else {
      expandedById[id] = true;
    }
    this.setState({
      expandedById,
    });
  };

  render () {
    const { classes, scriptList } = this.props;
    const { expandedById } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.titleBar}>
          <FilterTextField />
        </div>
        <div className={classes.contentWrapper}>
          {scriptList.map((scriptItem, idx) => {
            return (
              <div
                key={`wrapper${idx}`}
                className={expandedById[scriptItem.id] ? classes.sectionExpanded : classes.section}
              >
                <div className={classes.scriptTitleBar}>
                  <Typography variant="subtitle2" className={classes.titleText} >
                    {scriptItem.title}
                  </Typography>
                  {expandedById[scriptItem.id]
                    ? (
                      <ToolbarButton
                        iconType="ExpandLess"
                        primary={true}
                        tooltip="Collapse"
                        onClick={this.handleToggleExpandSection(scriptItem.id)}
                      />
                    )
                    : (
                      <ToolbarButton
                        iconType="ExpandMore"
                        primary={true}
                        tooltip="Expand"
                        onClick={this.handleToggleExpandSection(scriptItem.id)}
                      />
                    )
                  }
                  <ToolbarButton
                    iconType="FileCopy"
                    primary={true}
                    tooltip="Generate the source code for a new functions list"
                  />
                </div>
                <div className={classes.scriptViewWrapper}>
                  <ScriptView
                    propsSampleObjectText={scriptItem.scriptText}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PanelWithScriptList);
