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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import green from '@material-ui/core/colors/green';

const PagesListItem = withStyles(theme => ({
  root: {
    alignItems: 'flex-start',
    position: 'relative'
  },
  dense: {
    paddingTop: '0px',
    paddingBottom: '0px',
    '&:hover': {
      backgroundColor: '#eceff1',
    },
    userSelect: 'none',
    borderRadius: '4px',
  }
}))(ListItem);

const PagesListItemText = withStyles({
  root: {
    padding: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
})(ListItemText);

const styles = theme => ({
  root: {
    padding: '10px',
    minWidth: '200px',
  },
  testItemText: {
    // fontWeight: 700,
    color: green['700'],
  },
});

class PagesList extends React.Component {
  static propTypes = {
    pages: PropTypes.array,
    selectedPage: PropTypes.object,
    onChangeSelected: PropTypes.func,
  };

  static defaultProps = {
    pages: [],
    selectedPage: {},
    onChangeSelected: () => {
      console.info('PagesList.onChangeSelected is not set');
    }
  };

  handleListItemClick = (index) => (event) => {
    const { pages, onChangeSelected } = this.props;
    onChangeSelected(pages[index]);
  };

  render () {
    const { classes, selectedPage, pages } = this.props;
    const list = [];
    if (pages && pages.length > 0) {
      pages.forEach((page, index) => {
        let itemTextClassNames = '';
        if (page.isTest) {
          itemTextClassNames = classes.testItemText;
        }
        list.push(
          <PagesListItem
            key={`pageItem_${page.pagePath}`}
            button={true}
            selected={selectedPage.pagePath === page.pagePath}
            onClick={this.handleListItemClick(index)}
          >
            <PagesListItemText primary={<span className={itemTextClassNames}>{`/${page.pagePath}`}</span>} />
          </PagesListItem>
        );
      });
    }
    return (
      <div className={classes.root}>
        <List component="nav" disablePadding={true} dense={true}>
          {list}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(PagesList);
