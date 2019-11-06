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
import MarkdownIt from 'markdown-it';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import ToolbarButton from './ToolbarButton';
import ResourceIcon from './ResourceIcon';
import * as constants from '../../../commons/constants';

const styles = theme => ({
  root: {
    height: '100%',
    minWidth: '250px'
  },
  card: {
    padding: '15px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    width: '100%'
  },
  cardBody: {
    marginTop: '10px',
    marginBottom: '10px',
    fontSize: '14px'
  },
});

class UserFunctionDescription extends React.Component {
  static propTypes = {
    displayName: PropTypes.string,
    comments: PropTypes.array,
    onSearchClick: PropTypes.func,
  };

  static defaultProps = {
    displayName: null,
    comments: [],
    onSearchClick: () => {
      console.info('UserFunctionDescription.onSearchClick is not set.');
    },
  };

  constructor (props) {
    super(props);
    this.markdown = new MarkdownIt();
  }

  handleSearchClick = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const {displayName, onSearchClick} = this.props;
    onSearchClick(displayName);
  };

  render () {
    const {displayName, comments, classes} = this.props;
    let descriptionText = comments && comments.length > 0
      ? comments.join('\n').trim()
      : `${displayName} (no description)`;
    return (
      <Paper className={classes.root} elevation={1}>
        <div className={classes.card}>
          <div className={classes.cardHeader}>
            <ResourceIcon resourceType={constants.GRAPH_MODEL_USER_FUNCTION_TYPE} />
            <Typography variant="subtitle2">
              &nbsp;&nbsp;{displayName}&nbsp;&nbsp;
            </Typography>
            <ToolbarButton
              switchedOn={true}
              onClick={this.handleSearchClick}
              title="Search"
              iconType="Search"
              tooltip="Find in the project"
            />
          </div>
          <Divider />
          <div
            className={classes.cardBody}
            dangerouslySetInnerHTML={{
              __html: this.markdown.render(descriptionText)
            }}
          />
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(UserFunctionDescription);
