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
      <pre className={classes.formatted}>
        <code>
          undefined
        </code>
      </pre>
    );
  }
}

export default withStyles(styles)(ScriptView);
