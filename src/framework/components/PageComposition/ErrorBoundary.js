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

const style = {color: 'white', backgroundColor: 'red', borderRadius: '4px', padding: '.5em', overflow: 'auto'};

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch (error, info) {
    this.setState({ hasError: true, error });
  }

  render () {
    const {hasError, error} = this.state;
    if (hasError) {
      const { pageName } = this.props;
      return (
        <div style={style}>
          <code>Error occurred in "{pageName}" page: </code>
          <pre><code>{error && error.message}</code></pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;