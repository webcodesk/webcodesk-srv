import React from 'react';
import PropTypes from 'prop-types';
import createContainerActions from '../../store/actions';

const componentName = 'applicationStartWrapper';
const componentInstance = 'wrapperInstance';
const containerKey = `${componentName}_${componentInstance}`;

class StartWrapper extends React.Component {
  static propTypes = {
    actionSequences: PropTypes.object.isRequired,
    store: PropTypes.any.isRequired,
  };

  componentDidMount () {
    const { actionSequences, store } = this.props;
    let containerHandlers = [];
    let componentKey;
    const actionSequence = actionSequences[containerKey];
    if (actionSequence) {
      containerHandlers = actionSequence.events;
      componentKey = actionSequence.componentKey;
    }
    if (containerHandlers.length > 0) {
      const actions = createContainerActions(containerKey, containerHandlers);
      const onDidMountAction = actions['onApplicationStart'];
      if (onDidMountAction) {
        store.dispatch(onDidMountAction.apply(null, null));
      }
    }
  }

  render () {
    return this.props.children;
  }
}

export default StartWrapper;
