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

const styles = theme => ({
  placeholder: {
    padding: '1em',
    border: '1px dashed #cccccc',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dddddd'
  }
});

const Placeholder = ({title, height, classes}) => {
  const style = {};
  if (height) {
    style.height = height;
  }
  return (
    <div className={classes.placeholder} style={style}>
      <code>
        {title}
      </code>
    </div>
  );
};

Placeholder.propTypes = {
  title: PropTypes.string,
  height: PropTypes.string,
};

Placeholder.defaultProps = {
  title: 'no title',
  height: null,
};

export default withStyles(styles)(Placeholder);