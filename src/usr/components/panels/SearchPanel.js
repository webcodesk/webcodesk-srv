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
