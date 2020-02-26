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
import Application from '../framework';
import schema from './schema';
import userComponents from './indices/userComponents';
import userFunctions from './indices/userFunctions';

let packageJson = {};
if (process.env.NODE_ENV !== 'production') {
  packageJson = require('../../package.json');
}

const App = () => (
  <Application
    name={packageJson.name}
    version={packageJson.version}
    schema={schema}
    userComponents={userComponents}
    userFunctions={userFunctions}
  />
);

export default App;
