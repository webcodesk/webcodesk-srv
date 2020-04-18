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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import createContainerSelector from '../../store/selectors';
import createContainerActions from '../../store/actions';

class Container extends React.Component {
  constructor (props, context) {
    super(props, context);
    const {
      componentName,
      componentInstance,
    } = this.props;
    this.wrappedHandlers = {};
    const { containerEventHandlers, actions } = this.props;
    if (containerEventHandlers && containerEventHandlers.length > 0) {
      containerEventHandlers.forEach(eventHandler => {
        this.wrappedHandlers[eventHandler.name] = function () {
          const args = arguments;
          const handlerAction = actions[eventHandler.name];
          if (handlerAction) {
            handlerAction.apply(null, [args[0], args[1]]);
          } else {
            console.error(
              `[Framework] Event handler was not found for ${eventHandler.name} event in ${componentName} instance ${componentInstance}`
            );
          }
        };
      });
    }
  }

  render () {
    const {
      wrappedComponent,
      wrappedProps,
      stateProps,
      populatedProps,
      children
    } = this.props;
    return React.createElement(
      wrappedComponent,
      { ...wrappedProps, ...this.wrappedHandlers, ...populatedProps, ...stateProps },
      children
    );
  }
}

class Component extends React.Component {
  render () {
    const {
      wrappedComponent,
      wrappedProps,
      children
    } = this.props;
    return React.createElement(
      wrappedComponent,
      wrappedProps,
      children
    );
  }
}

export default function createContainer (
  wrappedComponent,
  componentName,
  componentInstance,
  componentKey,
  containerEventHandlers,
  containerProperties,
  props = {},
  populatedProps,
  nestedComponents = null
) {

  if ((containerProperties && containerProperties.length > 0)
    || (containerEventHandlers && containerEventHandlers.length > 0)) {
    // create a connected container only for components that participate in the flow
    const actions = createContainerActions(`${componentName}_${componentInstance}`, containerEventHandlers);
    const mapDispatchToProps = (dispatch) => {
      return { actions: bindActionCreators(actions, dispatch) };
    };

    const innerStructuresSelectorObject = {};
    if (containerProperties && containerProperties.length > 0) {
      containerProperties.forEach(propertyName => {
        innerStructuresSelectorObject[propertyName] =
          createContainerSelector(componentName, componentInstance, propertyName);
      });
    }

    const mapStateToProps = createStructuredSelector({
      stateProps: createStructuredSelector(innerStructuresSelectorObject),
    });

    const wrapperProps = {
      componentKey,
      componentName,
      componentInstance,
      containerEventHandlers,
      containerProperties,
      wrappedProps: props,
      populatedProps,
      wrappedComponent,
    };

    return React.createElement(
      connect(mapStateToProps, mapDispatchToProps)(Container),
      { ...wrapperProps, key: `container_${props.key}` },
      nestedComponents
    );
  }

  return React.createElement(
    Component,
    { wrappedComponent, wrappedProps: props, key: `component_${props.key}` },
    nestedComponents
  );
}