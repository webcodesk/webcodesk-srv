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

import values from 'lodash/values';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import * as constants from '../../../commons/constants';
import ResourceIcon from '../commons/ResourceIcon';

const styles = theme => ({
  mutedText: {
    color: theme.palette.text.disabled,
  },
  errorText: {
    color: '#D50000',
  }
});

const PageTreeListGroup = withStyles(theme => ({
  root: {
    alignItems: 'flex-start',
    position: 'relative',
    cursor: 'default',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    userSelect: 'none',
  },
  dense: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  }
}))(ListItem);

const PageTreeListGroupText = withStyles({
  root: {
    padding: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
})(ListItemText);

const PageTreeListGroupIcon = withStyles({
  root: {
    marginRight: 0,
    padding: '3px',
  }
})(ListItemIcon);

class PageTreeGroup extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    paddingLeft: PropTypes.string,
    onClick: PropTypes.func,
    onErrorClick: PropTypes.func,
  };

  static defaultProps = {
    name: "",
    paddingLeft: '0px',
    draggedItem: null,
    onClick: () => {
      console.info('PageTreeGroup.onClick is not set');
    },
    onErrorClick: () => {
      console.info('PageTreeGroup.onErrorClick is not set');
    },
  };

  handleClick = () => {
    const { node: { key } } = this.props;
    this.props.onClick(key);
  };

  handleErrorClick = () => {
    const { node: {key, props}, onErrorClick, onClick } = this.props;
    if (props && props.errors) {
      onErrorClick(values(props.errors).map(error => ({message: error})));
    }
    onClick(key);
  };

  render () {
    if (!this.props.name) {
      return null;
    }
    const { name, paddingLeft } = this.props;
    return (
      <PageTreeListGroup
        style={{paddingLeft}}
      >
        <PageTreeListGroupIcon>
          <ResourceIcon resourceType={constants.GRAPH_MODEL_DIR_TYPE} />
        </PageTreeListGroupIcon>
        <PageTreeListGroupText
          title={name}
          primary={
            <span style={{ whiteSpace: 'nowrap' }}>
              <span>{name}:</span>
            </span>
          }
        />
      </PageTreeListGroup>
    );
  }
}

export default withStyles(styles)(PageTreeGroup);
