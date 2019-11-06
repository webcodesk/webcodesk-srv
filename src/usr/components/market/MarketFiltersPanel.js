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
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MarketFilterField from './MarketFilterField';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
    minWidth: '200px'
  }
});

class MarketFiltersPanel extends React.Component {
  static propTypes = {
    searchValues: PropTypes.array,
    searchLang: PropTypes.string,
    searchTagsList: PropTypes.array,
    onChangeLang: PropTypes.func,
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    searchValues: [],
    searchLang: 'javascript',
    searchTagsList: [],
    onChangeLang: () => {
      console.info('MarketFiltersPanel.onChangeLang is not set');
    },
    onSearch: () => {
      console.info('MarketFiltersPanel.onSearch is not set');
    },
  };

  handleSearchTag = (index) => (value) => {
    const searchValues = this.props.searchValues.map(item => { return !!item ? {...item} : null; });
    if (value) {
      searchValues[index] = value;
    } else {
      searchValues[index] = null;
    }
    this.props.onSearch(searchValues);
  };

  handleChangeLang = (e) => {
    this.props.onChangeLang(e.target.value);
  };

  render () {
    const {classes, searchTagsList, searchValues, searchLang} = this.props;
    return (
      <div className={classes.root}>
        <MarketFilterField
          value={searchValues[0]}
          onChange={this.handleSearchTag(0)}
          searchTagsList={searchTagsList}
        />
        <Typography variant="overline" gutterBottom={false}>OR</Typography>
        <MarketFilterField
          value={searchValues[1]}
          onChange={this.handleSearchTag(1)}
          searchTagsList={searchTagsList}
        />
        <Typography variant="overline" gutterBottom={false}>OR</Typography>
        <MarketFilterField
          value={searchValues[2]}
          onChange={this.handleSearchTag(2)}
          searchTagsList={searchTagsList}
        />
        <Typography variant="overline" gutterBottom={false}>OR</Typography>
        <MarketFilterField
          value={searchValues[3]}
          onChange={this.handleSearchTag(3)}
          searchTagsList={searchTagsList}
        />
        <Typography variant="overline" gutterBottom={false}>OR</Typography>
        <MarketFilterField
          value={searchValues[4]}
          onChange={this.handleSearchTag(4)}
          searchTagsList={searchTagsList}
        />
        <RadioGroup
          row={true}
          value={searchLang}
          onChange={this.handleChangeLang}
        >
          <FormControlLabel
            value="javascript"
            labelPlacement="end"
            control={<Radio color="primary" />}
            label="JavaScript"
          />
          <FormControlLabel
            value="typescript"
            labelPlacement="end"
            control={<Radio color="primary" />}
            label="TypeScript"
          />
        </RadioGroup>
      </div>
    );
  }
}

export default withStyles(styles)(MarketFiltersPanel);
