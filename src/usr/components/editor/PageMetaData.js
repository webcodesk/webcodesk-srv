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

import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
  root: {
    padding: '10px',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  section: {
    width: '100%',
  },
  rootInputLabel: {
    fontSize: '0.8125rem',
  },
  rootInput: {
    fontSize: '0.8125rem',
  }
});

class PageMetaData extends React.Component {
  static propTypes = {
    metaData: PropTypes.object,
    onChangeMetaData: PropTypes.func,
  };

  static defaultProps = {
    metaData: {},
    onChangeMetaData: () => {
      console.info('PageMetaData.onChangeMetaData is not set');
    }
  };

  constructor (props) {
    super(props);
    this.state = {
      metaData: cloneDeep(this.props.metaData),
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { metaData } = this.props;
    if (metaData !== prevProps.metaData) {
      this.setState({
        metaData: cloneDeep(metaData),
      });
    }
  }

  handleChangeTitle = (e) => {
    const newMetaData = { ...this.state.metaData, ...{ title: e.target.value } };
    this.setState({
      metaData: newMetaData,
    });
    this.debounceHandleChangeMetaData(newMetaData);
  };

  debounceHandleChangeMetaData = debounce(metaData => {
    this.props.onChangeMetaData(metaData);
  }, 1000);

  render () {
    const { classes } = this.props;
    const { metaData } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.section}>
          <FormControl margin="dense" fullWidth={true}>
            <InputLabel
              htmlFor="title-meta-data-input"
              classes={{
                root: classes.rootInputLabel
              }}
            >
              Page Title
            </InputLabel>
            <Input
              id="title-meta-data-input"
              classes={{
                root: classes.rootInput
              }}
              value={metaData.title} onChange={this.handleChangeTitle}
            />
          </FormControl>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PageMetaData);
