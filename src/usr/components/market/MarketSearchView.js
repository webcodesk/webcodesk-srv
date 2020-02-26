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
import Typography from '@material-ui/core/Typography';
import SplitPane from '../splitPane';
import {CommonToolbarDivider} from '../commons/Commons.parts';
import ToolbarButton from '../commons/ToolbarButton';
import LoadingPopover from '../commons/LoadingPopover';
import {
  MarketBoardToolbarPanel,
  MarketBoardToolbar,
} from './Market.parts';
import MarketGroupGrid from './MarketGroupGrid';
import MarketFiltersPanel from './MarketFiltersPanel';
import MarketErrorPopover from './MarketErrorPopover';
import MarketBoardPager from './MarketBoardPager';

import MarketProjectCard from "./MarketProjectCard";

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  left: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  central: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  centralTopPane: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '39px',
    right: 0,
    minWidth: '300px'
  },
  centralContentPane: {
    position: 'absolute',
    top: '40px',
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'auto',
    padding: '2em',
    backgroundColor: '#eceff1',
  },
  leftTopPane: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '39px',
    right: 0,
  },
  leftContentPane: {
    position: 'absolute',
    top: '40px',
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'auto',
  },
  foundTitleLabel: {
    marginRight: '16px',
    marginLeft: '16px',
    whiteSpace: 'nowrap'
  }
});

const ITEMS_PER_PAGE = 20;

class MarketSearchView extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    searchLang: PropTypes.string,
    searchValues: PropTypes.array,
    searchTagsList: PropTypes.array,
    projectsList: PropTypes.array,
    onChangeLang: PropTypes.func,
    onSearch: PropTypes.func,
    onClose: PropTypes.func,
    onSelectProject: PropTypes.func,
    onInstall: PropTypes.func,
  };

  static defaultProps = {
    isLoading: false,
    error: '',
    searchLang: '',
    searchValues: [],
    searchTagsList: [],
    projectsList: [],
    onChangeLang: () => {
      console.info('MarketProjectView.onChangeLang is not set');
    },
    onSearch: () => {
      console.info('MarketProjectView.onSearch is not set');
    },
    onClose: () => {
      console.info('MarketProjectView.onClose is not set');
    },
    onSelectProject: () => {
      console.info('MarketProjectView.onSelectProject is not set');
    },
    onInstall: () => {
      console.info('MarketProjectView.onInstall is not set');
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
    };
  }

  handleChangeLang = (searchLang) => {
    this.props.onChangeLang(searchLang);
  };

  handleSearch = (searchValues) => {
    this.props.onSearch(searchValues);
  };

  handleClose = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onClose();
  };

  handleSetPage = (newPage) => {
    this.setState({currentPage: newPage});
  };

  handleSelectProject = (projectModel) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onSelectProject(projectModel);
  };

  handleInstall = (projectModel) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onInstall(projectModel);
  };

  render() {
    const {currentPage} = this.state;
    const {classes, isLoading, error, searchTagsList, projectsList, searchValues, searchLang} = this.props;
    const pagesCount = Math.ceil(projectsList.length / ITEMS_PER_PAGE);
    const pageProjectsList = projectsList.slice(
      (currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE
    );
    const validSearchValues = searchValues.filter(i => i && i.value);
    return (
      <SplitPane
        split="vertical"
        minSize={250}
        defaultSize={250}
      >
        <div className={classes.left}>
          <div className={classes.leftTopPane}>
            <MarketBoardToolbarPanel>
              <MarketBoardToolbar disableGutters={true} dense="true">
                <ToolbarButton
                  iconType="Close"
                  onClick={this.handleClose}
                  title="Close"
                />
              </MarketBoardToolbar>
            </MarketBoardToolbarPanel>
          </div>
          <div className={classes.leftContentPane}>
            <MarketFiltersPanel
              searchLang={searchLang}
              searchValues={searchValues}
              onChangeLang={this.handleChangeLang}
              onSearch={this.handleSearch}
              searchTagsList={searchTagsList}
            />
          </div>
        </div>
        <div className={classes.central}>
          <div className={classes.centralTopPane}>
            <MarketBoardToolbarPanel>
              <MarketBoardToolbar disableGutters={true} dense="true">
                <Typography className={classes.foundTitleLabel} variant="body1">
                  {validSearchValues && validSearchValues.length > 0
                    ? (
                      `Found ${projectsList.length}`
                    )
                    : (
                      'All'
                    )
                  }
                </Typography>
                <CommonToolbarDivider/>
                <MarketBoardPager
                  currentPageValue={currentPage}
                  pagesNumber={pagesCount}
                  onChange={this.handleSetPage}
                />
              </MarketBoardToolbar>
            </MarketBoardToolbarPanel>
          </div>
          <div className={classes.centralContentPane}>
            {isLoading && <LoadingPopover/>}
            {error && <MarketErrorPopover error={error}/>}
            <MarketGroupGrid>
              {pageProjectsList.map((projectItem, idx) => {
                return (
                  <MarketProjectCard
                    key={`card_${idx}`}
                    content={projectItem.projectDescription}
                    headerTitle={projectItem.projectName}
                    hasActions={true}
                    license={projectItem.license}
                    onInstall={this.handleInstall(projectItem)}
                    onClick={this.handleSelectProject(projectItem)}
                  />
                );
              })}
            </MarketGroupGrid>
          </div>
        </div>
      </SplitPane>
    );
  }
}

export default withStyles(styles)(MarketSearchView);
