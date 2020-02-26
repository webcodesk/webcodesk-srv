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

import queryString from 'query-string';
import forOwn from 'lodash/forOwn';
import uniqueId from 'lodash/uniqueId';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isObject';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary';
import NotFoundComponent from '../NotFoundComponent';
import createContainer from './Container';
import WarningComponent from '../WarningComponent';

class PageComposition extends Component {

  static propTypes = {
    userComponents: PropTypes.object,
    componentsTree: PropTypes.object,
    actionSequences: PropTypes.object,
    targetProperties: PropTypes.object,
    routePath: PropTypes.string,
    pageParams: PropTypes.object,
    pageSearch: PropTypes.string,
  };

  static defaultProps = {
    userComponents: {},
    componentsTree: {},
    actionSequences: {},
    targetProperties: {},
    routePath: '',
    pageParams: {},
    pageSearch: '',
  };

  constructor (props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
  }

  renderShape (descriptionShape) {
    const result = {};
    forOwn(descriptionShape, (value, prop) => {
      if (value) {
        if (isArray(value)){
          result[prop] = this.renderArray(value);
        } else if (isPlainObject(value)) {
          if (value.type && value.instance) {
            result[prop] = this.renderComponent(value);
          } else {
            result[prop] = this.renderShape(value);
          }
        } else {
          result[prop] = value;
        }
      } else {
        result[prop] = value;
      }
    });
    return result;
  }

  renderArray (descriptionArray) {
    const result = [];
    if (descriptionArray.length > 0) {
      descriptionArray.forEach(descriptionItem => {
        if (descriptionItem) {
          if (isArray(descriptionItem)) {
            result.push(this.renderArray(descriptionItem));
          } else if (isPlainObject(descriptionItem)) {
            if (descriptionItem.type && descriptionItem.instance) {
              result.push(this.renderComponent(descriptionItem));
            } else {
              result.push(this.renderShape(descriptionItem));
            }
          } else {
            result.push(descriptionItem);
          }
        } else {
          result.push(descriptionItem);
        }
      });
    }
    return result;
  }

  renderComponent (description) {
    const {
      userComponents,
      actionSequences,
      targetProperties,
      routePath,
      pageParams,
      pageSearch,
    } = this.props;
    const pageQuery = queryString.parse(pageSearch);
    if (!description) {
      return null;
    }

    const { type, instance, key, props, children } = description;
    if (!type) {
      return null;
    }
    let propsComponents = {};
    if (props) {
      propsComponents = this.renderShape(props);
    }
    let nestedComponents = [];
    if (children && children.length > 0) {
      nestedComponents = children.map(child => {
        return this.renderComponent(child);
      });
    }
    if (propsComponents.children && isArray(propsComponents.children)) {
      nestedComponents = nestedComponents.concat(propsComponents.children);
      delete propsComponents.children;
    }
    const validType = type || 'div';
    if (validType.charAt(0) === '_') {
      const pageComponentType = validType.substr(1);
      return React.createElement(
        pageComponentType,
        { key: key || uniqueId(validType), ...props, ...propsComponents },
        nestedComponents
      );
    } else {
      // this is a user custom component, create container for it
      const wrappedComponent = get(userComponents, validType, null);
      if (!wrappedComponent) {
        return React.createElement(
          NotFoundComponent,
          { key: uniqueId('notFound'), componentName: validType }
        );
      }
      const { _doNotCreateContainer } = props || {};
      const containerKey = `${type}_${instance}`;

      if (_doNotCreateContainer) {
        return React.createElement(
          wrappedComponent,
          { key: key || uniqueId(validType), ...props, ...propsComponents },
          nestedComponents
        );
      }

      let containerHandlers = [];
      let componentKey;
      const actionSequence = actionSequences[containerKey];
      if (actionSequence) {
        containerHandlers = actionSequence.events;
        componentKey = actionSequence.componentKey;
      }
      let populatedProps = {};
      let containerProperties = [];
      const propertiesObject = targetProperties[containerKey];
      const parameterValue = pageParams ? pageParams['parameter'] : undefined;
      const normalizedRoutePath = routePath.substr(1).replace('/:parameter?', '');
      let propertyName = '';
      if (propertiesObject) {
        containerProperties = Object.keys(propertiesObject);
        if (!isUndefined(parameterValue) || (pageQuery && !isEmpty(pageQuery))) {
          forOwn(propertiesObject, (value, key) => {
            if (value && value.populatePath === normalizedRoutePath) {
              populatedProps[key] = parameterValue || pageQuery;
              propertyName = key;
            }
          });
        }
      }
      return createContainer(
        wrappedComponent,
        type,
        instance,
        componentKey,
        containerHandlers,
        containerProperties,
        {
          key: key || `${containerKey}_${uniqueId('c')}`,
          ...props,
          ...propsComponents
        },
        populatedProps,
        nestedComponents
      );
    }
  };

  renderPage () {
    const {componentsTree} = this.props;
    if (componentsTree && !isEmpty(componentsTree)) {
      return this.renderComponent(componentsTree);
    }
    return (<WarningComponent message="Page does not have components" />);
  }

  render () {
    return (
      <ErrorBoundary pageName={this.props.routePath}>
        {this.renderPage()}
      </ErrorBoundary>
    );
  }
}

export default PageComposition;
