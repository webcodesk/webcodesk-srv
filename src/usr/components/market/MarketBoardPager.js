import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ToolbarButton from '../commons/ToolbarButton';

const styles = ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    marginLeft: '8px',
    marginRight: '8px',
    whiteSpace: 'nowrap',
    color: '#cdcdcd'
  }
});

const DIRECTION_FORWARD = 'DIRECTION_FORWARD';
const DIRECTION_BACKWARD = 'DIRECTION_BACKWARD';
const DIRECTION_FIRST = 'DIRECTION_FIRST';
const DIRECTION_LAST = 'DIRECTION_LAST';

class MarketBoardPager extends React.Component {
  static propTypes = {
    currentPageValue: PropTypes.number,
    pagesNumber: PropTypes.number,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    currentPageValue: 1,
    pagesNumber: 5,
    onChange: () => {
      console.info('MarketBoardPager.onChange is not set');
    },
  };

  handleChange = (direction) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { currentPageValue, pagesNumber } = this.props;
    let newPage;
    switch (direction) {
      case DIRECTION_FIRST:
        newPage = 1;
        break;
      case DIRECTION_BACKWARD:
        newPage = currentPageValue - 1;
        break;
      case DIRECTION_FORWARD:
        newPage = currentPageValue + 1;
        break;
      case DIRECTION_LAST:
        newPage = pagesNumber;
        break;
      default:
        newPage = currentPageValue;
        break;
    }
    this.props.onChange(newPage);
  };

  handleSetPage = (page) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onChange(page);
  };

  render () {
    const { classes, currentPageValue, pagesNumber } = this.props;
    const pagesMenuItems = [];
    for(let i = 1; i <= pagesNumber; i++) {
      pagesMenuItems.push({
        label: `Page ${i}`,
        onClick: this.handleSetPage(i),
      });
    }
    const isFirstEnabled = currentPageValue > 1;
    const isBackwardEnabled = currentPageValue > 1;
    const isForwardEnabled = currentPageValue < pagesNumber;
    const isLastEnabled = currentPageValue < pagesNumber;
    return (
      <div className={classes.root}>
        <ToolbarButton
          iconType="FirstPage"
          disabled={!isFirstEnabled}
          onClick={this.handleChange(DIRECTION_FIRST)}
        />
        <ToolbarButton
          iconType="ChevronLeft"
          disabled={!isBackwardEnabled}
          onClick={this.handleChange(DIRECTION_BACKWARD)}
        />
        <ToolbarButton
          title={'' + currentPageValue}
          menuItems={pagesMenuItems}
        />
        <ToolbarButton
          iconType="ChevronRight"
          disabled={!isForwardEnabled}
          onClick={this.handleChange(DIRECTION_FORWARD)}
        />
        <ToolbarButton
          iconType="LastPage"
          disabled={!isLastEnabled}
          onClick={this.handleChange(DIRECTION_LAST)}
        />
        <Typography className={classes.label} variant="overline">Total pages: {pagesNumber}</Typography>
      </div>
    );
  }
}

export default withStyles(styles)(MarketBoardPager);
