import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer';

let composeWithDevTools;
if (process.env.NODE_ENV !== 'production') {
  const developmentOnly = require('redux-devtools-extension/developmentOnly');
  composeWithDevTools = developmentOnly.composeWithDevTools;
}

export function configureStore(initialState, helpersConfig, {name, version}) {
  const middleware = [thunk.withExtraArgument(helpersConfig)];

  let enhancer;

  if (process.env.NODE_ENV !== 'production') {

    // https://github.com/zalmoxisus/redux-devtools-extension#14-using-in-production
    const composeEnhancers = composeWithDevTools({
      // Options: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#options
      name: `${name}@${version}`,
    });

    // https://redux.js.org/docs/api/applyMiddleware.html
    enhancer = composeEnhancers(applyMiddleware(...middleware));
  } else {
    enhancer = applyMiddleware(...middleware);
  }

  // https://redux.js.org/docs/api/createStore.html
  return createStore(rootReducer, initialState, enhancer);
}
