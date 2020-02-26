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
