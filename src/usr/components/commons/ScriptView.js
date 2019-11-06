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
import { highlightBlock } from 'usr/components/commons/utils';

const styles = theme => ({
  codeBlock: {
    fontSize: '12px',
    borderRadius: '4px',
    backgroundColor: theme.palette.background.paper,
    padding: 0,
  },
  formatted: {
    border: 0,
    // backgroundColor: theme.palette.background.paper,
    padding: 0,
  }
});

class ScriptView extends React.Component {
  static propTypes = {
    propsSampleObjectText: PropTypes.string,
    extraClassName: PropTypes.string,
  };

  static defaultProps = {
    propsSampleObjectText: '',
    extraClassName: ''
  };

  constructor (props, context) {
    super(props, context);
    this.codeBlock = React.createRef();
  }

  componentDidMount () {
    if (this.codeBlock.current) {
      highlightBlock(this.codeBlock.current);
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.codeBlock.current) {
      highlightBlock(this.codeBlock.current);
    }
  }

  render () {
    const { classes, propsSampleObjectText, extraClassName } = this.props;
    if (propsSampleObjectText) {
      return (
        <pre className={classes.formatted}>
          <code
            ref={this.codeBlock}
            className={`${classes.codeBlock} ${extraClassName || ''}`}
          >
            {propsSampleObjectText}
          </code>
        </pre>
      );
    }
    return (
      <p>Empty</p>
    );
  }
}

export default withStyles(styles)(ScriptView);
