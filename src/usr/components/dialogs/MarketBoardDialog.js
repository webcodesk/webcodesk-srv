import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import { FullScreenDialog } from '../commons/Commons.parts';
import MarketProjectView from '../market/MarketProjectView';
import MarketSearchView from '../market/MarketSearchView';

function Transition (props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});

class MarketBoardDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    projectsType: PropTypes.string,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    searchTagsList: PropTypes.array,
    projectsList: PropTypes.array,
    selectedProject: PropTypes.object,
    onClose: PropTypes.func,
    onSearch: PropTypes.func,
    onBackToSearch: PropTypes.func,
    onSelectProject: PropTypes.func,
    onInstall: PropTypes.func,
    onOpenUrl: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    projectsType: null,
    isLoading: false,
    error: '',
    searchTagsList: [],
    projectsList: [],
    selectedProject: null,
    onClose: () => {
      console.info('MarketBoardDialog.onClose is not set');
    },
    onSearch: () => {
      console.info('MarketBoardDialog.onSearch is not set');
    },
    onBackToSearch: () => {
      console.info('MarketBoardDialog.onBackToSearch is not set');
    },
    onSelectProject: () => {
      console.info('MarketBoardDialog.onSelectProject is not set');
    },
    onInstall: () => {
      console.info('MarketBoardDialog.onInstall is not set');
    },
    onOpenUrl: () => {
      console.info('MarketBoardDialog.onOpenUrl is not set');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      searchValues: [],
      searchLang: 'javascript'
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { isOpen } = this.props;
    if (isOpen && !prevProps.isOpen) {
      const {searchValues, searchLang} = this.state;
      this.handleOpen({searchValues, searchLang});
    }
  }

  handleOpen = ({searchValues, searchLang}) => {
    const {onSearch, projectsType} = this.props;
    const validSearchValues = searchValues.map(i => {
      if (i && i.value) {
        return i.value;
      }
    });
    onSearch({projectsType, searchValues: validSearchValues, searchLang});
  };

  handleClose = () => {
    this.props.onClose(false);
  };

  handleChangeLang = (searchLang) => {
    this.setState({
      searchLang,
    });
    const {searchValues} = this.state;
    this.handleOpen({searchValues, searchLang});
  };

  handleSearch = (searchValues) => {
    this.setState({
      searchValues
    });
    const {searchLang} = this.state;
    this.handleOpen({searchValues, searchLang});
  };

  handleBackToSearch = () => {
    this.props.onBackToSearch();
  };

  handleSelectProject = (projectModel) => {
    this.props.onSelectProject({projectModel});
  };

  handleInstall = (projectModel) => {
    this.props.onInstall({projectModel});
  };

  handleOpenUrl = (url) => {
    this.props.onOpenUrl(url);
  };

  render () {
    const { searchValues, searchLang } = this.state;
    const {
      classes,
      isOpen,
      isLoading,
      selectedProject,
      error,
      searchTagsList,
      projectsList
    } = this.props;
    return (
      <FullScreenDialog
        fullScreen={true}
        open={isOpen}
        onClose={this.handleClose}
        TransitionComponent={Transition}
      >
        <div className={classes.root}>
          {selectedProject
            ? (
              <MarketProjectView
                isLoading={isLoading}
                error={error}
                selectedProject={selectedProject}
                onClose={this.handleClose}
                onBack={this.handleBackToSearch}
                onInstall={this.handleInstall}
                onOpenUrl={this.handleOpenUrl}
              />
            )
            : (
              <MarketSearchView
                isLoading={isLoading}
                error={error}
                searchLang={searchLang}
                searchValues={searchValues}
                searchTagsList={searchTagsList}
                projectsList={projectsList}
                onChangeLang={this.handleChangeLang}
                onSearch={this.handleSearch}
                onClose={this.handleClose}
                onSelectProject={this.handleSelectProject}
                onInstall={this.handleInstall}
              />
            )
          }
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(MarketBoardDialog);
