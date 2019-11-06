import React from 'react';
import Application, { initStore } from '@webcodesk/react-app-framework';
import schema from './schema';
import userComponents from './indices/userComponents';
import userFunctions from './indices/userFunctions';

const App = () => (
  <Application
    schema={schema}
    userComponents={userComponents}
    userFunctions={userFunctions}
  />
);

let packageJson = {};
if (process.env.NODE_ENV !== 'production') {
  packageJson = require('../../package.json');
}

export function initApp() {
  initStore(packageJson.name, packageJson.version);
}

export default App;
