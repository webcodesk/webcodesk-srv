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

import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export const StructureTabs = withStyles(theme => ({
  root: {
    minHeight: 'auto',
    minWidth: '190px',
    backgroundColor: '#f5f5f5',
  }
}))(Tabs);

export const StructureTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    minHeight: 'auto',
    minWidth: 'auto',
    paddingLeft: '5px',
    paddingRight: '5px'
  },
  wrapper: {
    flexDirection: 'row',
  },
  labelIcon: {
    paddingTop: 0,
  },
  labelContainer: {
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  selected: {
    backgroundColor: theme.palette.background.paper,
  }
}))(Tab);
