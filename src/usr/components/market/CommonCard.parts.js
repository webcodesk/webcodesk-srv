// import React from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';

export const CommonCardHeader = withStyles(theme => ({
  title: {
    fontSize: '16px',
    fontWeight: 700
  },
  subheader: {
    fontSize: '10px'
  }
}))(CardHeader);

export const CommonCardAvatar = withStyles(theme => ({
  root: {
    width: '1.5em',
    height: '1.5em',
    fontSize: '12px'
  }
}))(Avatar);

export const CommonCardContent = withStyles(theme => ({
  root: {
    flexGrow: 1,
  }
}))(CardContent);

export const CommonCardActionArea = withStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexDirection: 'column'
  }
}))(CardActionArea);

export const CommonCard = withStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  }
}))(Card);
