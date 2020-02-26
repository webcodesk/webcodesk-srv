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
import constants from '../../../commons/constants';
import Image from '@material-ui/icons/Image';
import Description from '@material-ui/icons/Description';
import DescriptionOutlined from '@material-ui/icons/DescriptionOutlined';
import Folder from '@material-ui/icons/Folder';
import FolderOutlined from '@material-ui/icons/FolderOutlined';
import Dashboard from '@material-ui/icons/Dashboard';
import DashboardOutlined from '@material-ui/icons/DashboardOutlined';
import CropOriginal from '@material-ui/icons/CropOriginal';
import Wallpaper from '@material-ui/icons/Wallpaper';
import WidgetsOutlined from '@material-ui/icons/WidgetsOutlined';
import Category from '@material-ui/icons/Category';
import Directions from '@material-ui/icons/Directions';
import DirectionsOutlined from '@material-ui/icons/DirectionsOutlined';
import SlowMotionVideo from '@material-ui/icons/SlowMotionVideo';
import Star from '@material-ui/icons/Star';
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
import GroupWork from '@material-ui/icons/GroupWork';
import GroupWorkOutlined from '@material-ui/icons/GroupWorkOutlined';
import Dns from '@material-ui/icons/Dns';
import DnsOutlined from '@material-ui/icons/DnsOutlined';
import SvgIcon from '@material-ui/core/SvgIcon';

const ShapePlus = (props) => {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d="M12,7.77L18.39,18H5.61L12,7.77M12,4L2,20H22" />
    </SvgIcon>
  );
};

class ResourceIcon extends React.Component {
  static propTypes = {
    resourceType: PropTypes.string,
    resourceSubtype: PropTypes.string,
    isOutlined: PropTypes.bool,
    isMuted: PropTypes.bool,
  };

  static defaultProps = {
    resourceType: null,
    resourceSubtype: null,
    isOutlined: false,
    isMuted: false,
  };

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const {resourceType, isOutlined, isMuted} = this.props;
    return resourceType !== nextProps.resourceType
      || isOutlined !== nextProps.isOutlined
      || isMuted !== nextProps.isMuted;
  }

  render () {
    const { resourceType, resourceSubtype, isOutlined, isMuted, customColor } = this.props;
    let result = null;
    let color = 'inherit';
    if (isMuted) {
      color = 'disabled';
    }
    switch (resourceType) {
      case constants.GRAPH_MODEL_COMPONENT_TYPE:
        result = (<CropOriginal fontSize="inherit" style={{color: customColor || '#795548'}} />);
        break;
      case constants.GRAPH_MODEL_COMPONENT_INSTANCE_TYPE:
      case constants.PAGE_COMPONENT_TYPE:
      case constants.PAGE_NODE_TYPE:
      case constants.GRAPH_MODEL_FLOW_COMPONENT_INSTANCE_TYPE:
        result = (<Image fontSize="inherit" style={{color: customColor || '#2196F3'}} />);
        break;
      case constants.COMPONENT_PROPERTY_ELEMENT_TYPE:
        result = (<Wallpaper fontSize="inherit" color="disabled" />);
        break;
      case constants.COMPONENT_PROPERTY_NODE_TYPE:
        result = (<Wallpaper fontSize="inherit" color="disabled" />);
        break;
      case constants.GRAPH_MODEL_PAGE_TYPE:
        result = isOutlined
          ? (<DashboardOutlined fontSize="inherit" style={{color: customColor || '#3F51B5'}} />)
          : (<Dashboard fontSize="inherit" style={{color: customColor || '#3F51B5'}} />);
        break;
      case constants.GRAPH_MODEL_TEMPLATE_TYPE:
        result = isOutlined
          ? (<WidgetsOutlined fontSize="inherit" style={{color: customColor || '#7e57c2'}} />)
          : (<WidgetsOutlined fontSize="inherit" style={{color: customColor || '#7e57c2'}} />);
        break;
      case constants.GRAPH_MODEL_FUNCTIONS_TYPE:
        result = isOutlined
          ? (<DnsOutlined fontSize="inherit" style={{color: customColor || '#006064'}} />)
          : (<Dns fontSize="inherit" style={{color: customColor || '#006064'}} />);
        break;
      case constants.GRAPH_MODEL_USER_FUNCTION_TYPE:
      case constants.GRAPH_MODEL_FLOW_USER_FUNCTION_TYPE:
        if (
          resourceSubtype === constants.GRAPH_MODEL_FLOW_TARGET_FUNCTION_TYPE ||
          resourceSubtype === constants.GRAPH_MODEL_TARGET_FUNCTION_TYPE
        ) {
          result = (<ShapePlus fontSize="inherit" style={{color: customColor || '#616161'}} />);
        } else {
          result = (<Category fontSize="inherit" style={{color: customColor || '#009688'}} />);
        }
        break;
      case constants.GRAPH_MODEL_FLOW_TYPE:
        result = isOutlined
          ? (<DirectionsOutlined fontSize="inherit" style={{color: customColor || '#FF9800'}} />)
          : (<Directions fontSize="inherit" style={{color: customColor || '#FF9800'}} />);
        break;
      case constants.GRAPH_MODEL_DIR_TYPE:
        result = isOutlined
          ? (<FolderOutlined fontSize="inherit" style={{color: customColor || '#90a4ae'}} />)
          : (<Folder fontSize="inherit" style={{color: customColor || '#90a4ae'}} />);
        break;
      case constants.GRAPH_MODEL_FILE_TYPE:
        result = isOutlined
          ? (<DescriptionOutlined fontSize="inherit" color={color} />)
          : (<Description fontSize="inherit" color={color} />);
        break;
      case constants.MARKET_PROJECT_TYPE:
        result = isOutlined
          ? (<GroupWorkOutlined fontSize="inherit" style={{color: customColor || '#3F51B5'}} />)
          : (<GroupWork fontSize="inherit" style={{color: customColor || '#3F51B5'}} />);
        break;
      case constants.RESOURCE_EDITOR_TAB_LIVE_PREVIEW_TYPE:
        result = (<SlowMotionVideo fontSize="inherit" style={{color: '#2e7d32'}} />);
        break;
      case constants.RESOURCE_EDITOR_TAB_README_PREVIEW_TYPE:
        result = (<ChromeReaderMode fontSize="inherit" style={{color: customColor || '#96011a'}} />);
        break;
      default:
        result = (<Star fontSize="inherit" color={color} />);
        break;
    }
    return result;
  }
}

export default ResourceIcon;
