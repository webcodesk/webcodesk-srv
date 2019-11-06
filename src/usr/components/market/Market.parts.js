import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const ToolbarPanel = (props) => {
  return (
    <div className={props.classes.root}>
      {props.children}
    </div>
  )
};

export const MarketBoardToolbarPanel = withStyles(theme => ({
  root: {
    display: 'flex',
    height: '39px',
    flexDirection: 'column',
    width: '100%',
    borderBottom: '1px solid #dddddd'
  }
}))(ToolbarPanel);

export const MarketBoardToolbar = withStyles(theme => ({
  root: {
    minHeight: '38px',
    height: '38px',
    flexWrap: 'nowrap',
  }
}))(Toolbar);

export const PreTypography = withStyles(theme => ({
  body1: {
    whiteSpace: 'pre-wrap'
  },
  body2: {
    whiteSpace: 'pre-wrap'
  }
}))(Typography);
