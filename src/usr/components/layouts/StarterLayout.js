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
import {withSnackbar} from 'notistack';
import {Helmet} from 'react-helmet';
import {cutFilePath} from '../commons/utils';

class StarterLayout extends React.Component {
  static propTypes = {
    projectConfigStatus: PropTypes.object,
    projectLayout: PropTypes.element,
    newProjectWizard: PropTypes.element,
    onMounted: PropTypes.func,
  };

  static defaultProps = {
    projectStatus: null,
    projectLayout: null,
    newProjectWizard: null,
    onMounted: () => {
      console.info('StarterLayout.onMounted is not set');
    },
  };

  componentDidMount() {
    this.props.onMounted();
  }

  render() {
    const {projectConfigStatus, projectLayout, newProjectWizard, children} = this.props;
    if (projectConfigStatus) {
      const {ready} = projectConfigStatus;
      if (ready) {
        return (
          <React.Fragment>
            <Helmet>
              <title>
                {projectConfigStatus.projectName} - {cutFilePath(projectConfigStatus.projectDirPath, 50)}
              </title>
            </Helmet>
            {projectLayout}
            {children}
          </React.Fragment>
        );
      }
      return (
        <React.Fragment>
          {newProjectWizard}
          {children}
        </React.Fragment>
      );
    }
    return (<span />);
  }
}

export default withSnackbar(StarterLayout);
