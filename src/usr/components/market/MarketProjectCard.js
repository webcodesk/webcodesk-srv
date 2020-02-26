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
import {withStyles} from '@material-ui/core/styles';
import Category from '@material-ui/icons/Category';
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Public from '@material-ui/icons/Public';
import Divider from '@material-ui/core/Divider';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {
  CommonCard,
  CommonCardActionArea,
  CommonCardHeader,
  CommonCardAvatar,
  CommonCardContent
} from './CommonCard.parts';
import { PreTypography } from './Market.parts';
import { cutText } from "../commons/utils";

const styles = theme => ({
  cardHeader: {
    borderTop: '4px solid #607d8b'
  },
  cardAvatar: {
    backgroundColor: '#607d8b',
  },
  imageBox: {
    height: '187px',
    overflow: 'hidden',
    // backgroundColor: '#f5f5f5',
    borderTop: '1px solid #f5f5f5',
    borderBottom: '1px solid #f5f5f5',
  },
  image: {
    width: '100%'
  },
  downloadCount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    flexWrap: 'nowrap',
    minWidth: '100px',
  },
  license: {
    display: 'flex',
    alignItems: 'center'
  },
  licenseLabel: {
    flexGrow: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: '#9e9e9e'
  },
  licenseIcon: {
    color: '#9e9e9e'
  },
  bottomNavigation: {
    backgroundColor: '#eeeeee'
  },
  bottomNavigationButton: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  },
  bottomNavigationIcon: {
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
});

class MarketProjectCard extends React.Component {
  static propTypes = {
    headerTitle: PropTypes.string,
    content: PropTypes.string,
    hasActions: PropTypes.bool,
    onClick: PropTypes.func,
    onInstall: PropTypes.func,
  };

  static defaultProps = {
    headerTitle: 'Header title',
    content: null,
    hasActions: false,
    onClick: () => {
      console.info('MarketProjectCard.onClick is not set');
    },
    onInstall: () => {
      console.info('MarketProjectCard.onInstall is not set');
    },
  };

  handleClick = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onClick();
  };

  handleInstall = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onInstall();
  };

  render() {
    const {
      classes,
      headerTitle,
      content,
      license,
      hasActions
    } = this.props;
    let descriptionText = content
      ? content.trim()
      : 'No description';
    if (descriptionText.length > 250) {
      descriptionText = descriptionText.substring(0, 250) + '...';
    }
    const headerTitleText = cutText(headerTitle, 100);
    return (
      <CommonCard>
        <CommonCardActionArea
          component="div"
          title="Click to select"
          onClick={this.handleInstall}
          className={classes.cardHeader}
        >
          <CommonCardHeader
            avatar={
              <CommonCardAvatar className={classes.cardAvatar}>
                <Category fontSize="inherit"/>
              </CommonCardAvatar>
            }
            title={headerTitleText}
          />
          <Divider/>
          <CommonCardContent>
            <PreTypography variant="body1" gutterBottom={true}>
              {descriptionText}
            </PreTypography>
          </CommonCardContent>
          <CardContent>
            <Typography variant="caption">
              <div className={classes.license}>
                <Public className={classes.licenseIcon} fontSize="inherit"/>
                <div className={classes.licenseLabel}>
                  &nbsp;License: &nbsp;{license || 'NONE'}
                </div>
              </div>
            </Typography>
          </CardContent>
        </CommonCardActionArea>
        {hasActions && (
          <Divider/>
        )}
        {hasActions && (
          <BottomNavigation
            showLabels
            className={classes.bottomNavigation}
          >
            <BottomNavigationAction
              label="Read more..."
              icon={<ChromeReaderMode className={classes.bottomNavigationIcon} />}
              onClick={this.handleClick}
            />
          </BottomNavigation>
        )}
      </CommonCard>
    );
  }
}

export default withStyles(styles)(MarketProjectCard);
