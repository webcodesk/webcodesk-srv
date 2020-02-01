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