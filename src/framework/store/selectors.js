import { createSelector } from 'reselect';

const select = (componentName, componentInstance, propertyName) => (state, props) => {
  const instanceState = state[`${componentName}_${componentInstance}`];
  if (instanceState) {
    if (props) {
      if (typeof instanceState[propertyName] !== 'undefined') {
        return instanceState[propertyName];
      }
      return props.wrappedProps[propertyName];
    } else {
      return instanceState[propertyName]
    }
  } else if (props) {
    return props.wrappedProps[propertyName];
  }
  return undefined;
};

export const createContainerSelector = (componentName, componentInstance, propertyName) => {
  return createSelector(
    select(componentName, componentInstance, propertyName),
    a => a
  );
};

export default createContainerSelector;
