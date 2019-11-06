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
import SearchTextField from '../commons/SearchTextField';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: '0 5px 0 5px',
    display: 'flex',
    alignItems: 'center',
  },
});

class SearchPanel extends React.Component {
  static propTypes = {
    searchText: PropTypes.string,
    onSearchItems: PropTypes.func,
    onCancelSearchItems: PropTypes.func,
  };

  static defaultProps = {
    searchText: '',
    onSearchItems: () => {
      console.info('SearchPanel.onSearchItems is not set');
    },
    onCancelSearchItems: () => {
      console.info('SearchPanel.onCancelSearchItems is not set');
    },
  };

  handleSearch = (searchText) => {
    this.props.onSearchItems(searchText);
  };

  handleCancelSearch = () => {
    this.props.onCancelSearchItems();
  };

  render () {
    const {classes, searchText} = this.props;
    return (
      <div className={classes.root}>
        <SearchTextField
          onSubmit={this.handleSearch}
          onCancel={this.handleCancelSearch}
          text={searchText}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SearchPanel);
