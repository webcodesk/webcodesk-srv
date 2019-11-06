import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const PagesListItem = withStyles(theme => ({
  root: {
    alignItems: 'flex-start',
    position: 'relative'
  },
  dense: {
    paddingTop: '0px',
    paddingBottom: '0px',
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
  }
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
        list.push(
          <PagesListItem
            key={`pageItem_${page.pagePath}`}
            button={true}
            selected={selectedPage.pagePath === page.pagePath}
            onClick={this.handleListItemClick(index)}
          >
            <PagesListItemText primary={`/${page.pagePath}`} />
          </PagesListItem>
        );
        // list.push(
        //   <Divider key={`pageDivider_${index}`} />
        // )
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
