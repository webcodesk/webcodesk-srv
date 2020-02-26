/*
 *     Webcodesk
 *     Copyright (C) 2019  Oleksandr (Alex) Pustovalov
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
