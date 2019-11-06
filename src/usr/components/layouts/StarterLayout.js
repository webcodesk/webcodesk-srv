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
