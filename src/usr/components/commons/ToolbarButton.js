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
import { cutText } from './utils';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import SvgIcon from '@material-ui/core/SvgIcon';

import LibraryBooks from '@material-ui/icons/LibraryBooks';
import Cached from '@material-ui/icons/Cached';
import BugReport from '@material-ui/icons/BugReport';
import Refresh from '@material-ui/icons/Refresh';
import Layers from '@material-ui/icons/Layers';
import FormatAlignRight from '@material-ui/icons/FormatAlignRight';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import SlowMotionVideo from '@material-ui/icons/SlowMotionVideo';
import Save from '@material-ui/icons/Save';
import Toc from '@material-ui/icons/Toc';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Stop from '@material-ui/icons/Stop';
import Close from '@material-ui/icons/Close';
import DesktopMac from '@material-ui/icons/DesktopMac';
import TabletMac from '@material-ui/icons/TabletMac';
import PhoneIphone from '@material-ui/icons/PhoneIphone';
import SettingsOverscan from '@material-ui/icons/SettingsOverscan';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Add from '@material-ui/icons/Add';
import FileCopy from '@material-ui/icons/FileCopy';
import Search from '@material-ui/icons/Search';
import Undo from '@material-ui/icons/Undo';
import Dvr from '@material-ui/icons/Dvr';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import NotificationImportant from '@material-ui/icons/NotificationImportant';
import NoteAdd from '@material-ui/icons/NoteAdd';
import Unarchive from '@material-ui/icons/Unarchive';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CloudUpload from '@material-ui/icons/CloudUpload';
import CloudCircle from '@material-ui/icons/CloudCircle';
import CropOriginal from '@material-ui/icons/CropOriginal';
import Category from '@material-ui/icons/Category';
import Dashboard from '@material-ui/icons/Dashboard';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Widgets from '@material-ui/icons/Widgets';
import MoreVert from '@material-ui/icons/MoreVert';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import Adjust from '@material-ui/icons/Adjust';
import MenuIcon from '@material-ui/icons/Menu';
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
import Receipt from '@material-ui/icons/Receipt';
import StayCurrentPortrait from '@material-ui/icons/StayCurrentPortrait';
import StayCurrentLandscape from '@material-ui/icons/StayCurrentLandscape';
import CollectionsBookmark from '@material-ui/icons/CollectionsBookmark';
import SettingsApplications from '@material-ui/icons/SettingsApplications';
import PlayArrow from '@material-ui/icons/PlayArrow';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import HelpOutline from '@material-ui/icons/HelpOutline';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import LocationSearching from '@material-ui/icons/LocationSearching';

import { CommonToolbarButton, CommonToolbarIconButton, CommonErrorBadge } from './Commons.parts';

const CopyToClipboard = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
    </SvgIcon>
  );
};

const CutToClipboard = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M19,3L13,9L15,11L22,4V3M12,12.5A0.5,0.5 0 0,1 11.5,12A0.5,0.5 0 0,1 12,11.5A0.5,0.5 0 0,1 12.5,12A0.5,0.5 0 0,1 12,12.5M6,20A2,2 0 0,1 4,18C4,16.89 4.9,16 6,16A2,2 0 0,1 8,18C8,19.11 7.1,20 6,20M6,8A2,2 0 0,1 4,6C4,4.89 4.9,4 6,4A2,2 0 0,1 8,6C8,7.11 7.1,8 6,8M9.64,7.64C9.87,7.14 10,6.59 10,6A4,4 0 0,0 6,2A4,4 0 0,0 2,6A4,4 0 0,0 6,10C6.59,10 7.14,9.87 7.64,9.64L10,12L7.64,14.36C7.14,14.13 6.59,14 6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22A4,4 0 0,0 10,18C10,17.41 9.87,16.86 9.64,16.36L12,14L19,21H22V20L9.64,7.64Z" />
    </SvgIcon>

  );
};

const PasteFromClipboard = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z" />
    </SvgIcon>
  );
};

const DocBottom = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M20 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H20A2 2 0 0 0 22 18V6A2 2 0 0 0 20 4M20 13H4V6H20Z" />
    </SvgIcon>
  );
};

const DocLeft = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M20 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H20A2 2 0 0 0 22 18V6A2 2 0 0 0 20 4M20 18H9V6H20Z" />
    </SvgIcon>
  );
};

const ToolbarButtonMenuItem = withStyles(theme => ({
  root: {
    fontSize: '14px',
    height: 'auto',
    paddingTop: '5px',
    paddingBottom: '5px',
  }
}))(MenuItem);

const ToolbarButtonMenuItemText = withStyles(theme => ({
  root: {
    fontSize: '14px',
    height: 'auto',
    paddingLeft: '10px',
    paddingRight: 0
  }
}))(ListItemText);

const ToolbarButtonMenuDivider = withStyles(theme => ({
  root: {
    marginTop: '5px',
    marginBottom: '5px',
  }
}))(Divider);

const styles = theme => ({
  buttonIcon: {
    fontSize: '16px',
    '&:hover': {
      color: `${theme.palette.primary.main} !important`
    },
  },
  buttonText: { marginLeft: '3px', whiteSpace: 'nowrap' },
  menuItemIcon: {
    margin: 0,
    fontSize: '14px'
  }
});

const icons = {
  LibraryBooks,
  Cached,
  Refresh,
  BugReport,
  Layers,
  FormatAlignRight,
  Edit,
  Delete,
  DeleteOutline,
  SlowMotionVideo,
  Save,
  Toc,
  FiberManualRecord,
  Stop,
  Close,
  SettingsOverscan,
  DesktopMac,
  TabletMac,
  PhoneIphone,
  ArrowBack,
  ArrowForward,
  Add,
  FileCopy,
  Search,
  Undo,
  Dvr,
  OpenInBrowser,
  NotificationImportant,
  NoteAdd,
  Unarchive,
  CloudDownload,
  CloudUpload,
  CloudCircle,
  CropOriginal,
  Category,
  Dashboard,
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
  OpenInNew,
  Widgets,
  MoreVert,
  ZoomIn,
  ZoomOut,
  Adjust,
  MenuIcon,
  ChromeReaderMode,
  Receipt,
  StayCurrentPortrait,
  StayCurrentLandscape,
  CollectionsBookmark,
  SettingsApplications,
  PlayArrow,
  PlayCircleOutline,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  HelpOutline,
  FormatListBulleted,
  ExpandMore,
  ExpandLess,
  LocationSearching,

  // extra icons
  CopyToClipboard,
  CutToClipboard,
  PasteFromClipboard,
  DocBottom,
  DocLeft

};

class ToolbarButton extends React.Component {
  static propTypes = {
    iconType: PropTypes.string,
    iconColor: PropTypes.string,
    title: PropTypes.string,
    switchedOn: PropTypes.bool,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    disabled: PropTypes.bool,
    tooltip: PropTypes.string,
    titleLengthLimit: PropTypes.number,
    error: PropTypes.bool,
    menuItems: PropTypes.array,
    className: PropTypes.string,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    iconType: '',
    iconColor: undefined,
    title: '',
    switchedOn: false,
    primary: false,
    secondary: false,
    disabled: false,
    tooltip: '',
    titleLengthLimit: 25,
    error: false,
    menuItems: [],
    className: '',
    onClick: () => {
      console.info('ToolbarButton.onClick is not set');
    },
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      anchorEl: null,
    };
  }

  handleMenuClick = e => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.setState({ anchorEl: e.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleMenuItemClick = func => e => {
    if (func) {
      func();
    }
    this.handleMenuClose();
  };

  render () {
    const {
      iconType,
      iconColor,
      switchedOn,
      primary,
      secondary,
      disabled,
      title,
      tooltip,
      classes,
      titleLengthLimit,
      error,
      menuItems,
      className,
      onClick
    } = this.props;
    let icon = icons[iconType] || null;
    let variant = 'text';
    let color = 'default';
    const iconProps = {
      className: classes.buttonIcon,
    };
    if (!disabled) {
      if (switchedOn) {
        variant = 'outlined';
        color = 'primary';
      } else if (primary) {
        color = 'primary';
      } else if (secondary) {
        color = 'secondary';
      }
      if (iconColor) {
        iconProps.style = {
          color: iconColor,
        };
      } else {
        iconProps.style = {
          color: color,
        };
      }
    }
    if (icon) {
      icon = React.createElement(icon, iconProps);
    }
    const menuItemsElements = [];
    if (menuItems.length > 0) {
      let menuItemIcon;
      menuItems.forEach((menuItem, menuItemIdx) => {
        if (menuItem.iconType) {
          menuItemIcon = icons[menuItem.iconType];
        } else {
          menuItemIcon = null;
        }
        if (menuItem.label === 'divider') {
          menuItemsElements.push(
              <ToolbarButtonMenuDivider
                key={`${menuItem.label}_${menuItemIdx}`}
              />
          );
        } else {
          menuItemsElements.push(
            <ToolbarButtonMenuItem
              key={`${menuItem.label}_${menuItemIdx}`}
              title={menuItem.tooltip}
              onClick={this.handleMenuItemClick(menuItem.onClick)}
            >
              { menuItemIcon && (
                <ListItemIcon className={classes.menuItemIcon}>
                  {React.createElement(menuItemIcon, {
                    className: classes.buttonIcon,
                  })}
                </ListItemIcon>
              )}
              <ToolbarButtonMenuItemText disableTypography={true}>{menuItem.label}</ToolbarButtonMenuItemText>
            </ToolbarButtonMenuItem>
          );
        }
      });
    }
    if (title) {
      // with text toolbar button
      const textElement = (
        <span className={classes.buttonText}>
          {error
            ? (
              <CommonErrorBadge badgeContent={' '} color="secondary">
                <span>{cutText(title, titleLengthLimit)}</span>
              </CommonErrorBadge>
            )
            : (
              <span>{cutText(title, titleLengthLimit)}</span>
            )
          }
        </span>
      );
      if (menuItemsElements.length > 0) {
        const { anchorEl } = this.state;
        return (
          <div className={className}>
            <CommonToolbarButton
              size="small"
              color={color}
              variant={variant}
              disabled={disabled}
              title={tooltip}
              aria-owns={anchorEl ? 'simple-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleMenuClick}
            >
              {icon}
              {textElement}
            </CommonToolbarButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleMenuClose}
            >
              {menuItemsElements}
            </Menu>
          </div>
        );
      }
      return (
        <CommonToolbarButton
          size="small"
          color={color}
          variant={variant}
          onClick={onClick}
          disabled={disabled}
          title={tooltip}
          className={className}
        >
          {icon}
          {textElement}
        </CommonToolbarButton>
      );
    }
    // icon toolbar button
    if (menuItemsElements.length > 0) {
      const { anchorEl } = this.state;
      return (
        <div className={className}>
          <CommonToolbarIconButton
            size="small"
            color={color}
            variant={variant}
            disabled={disabled}
            title={tooltip}
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleMenuClick}
          >
            {icon}
          </CommonToolbarIconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleMenuClose}
          >
            {menuItemsElements}
          </Menu>
        </div>
      );
    }
    return (
      <CommonToolbarIconButton
        size="small"
        color={color}
        variant={variant}
        onClick={onClick}
        disabled={disabled}
        title={tooltip}
        className={className}
      >
        {icon}
      </CommonToolbarIconButton>
    );
  }
}

export default withStyles(styles)(ToolbarButton);
