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
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { configureStore } from './store/store';
import { clearActionsCache } from './store/actions';
import { createActionSequences } from './store/sequences';
import { createInitialState } from './store/state';

import PageRouter from './components/PageRouter';
import StartWrapper from './components/StartWrapper';
import WarningComponent from './components/WarningComponent';

const initStore = (pages, name, version) => {
  const initialState = createInitialState(pages);
  const history = createBrowserHistory();
  const store = configureStore(initialState, { history }, { name, version });

  return {store, history};
};

class Application extends React.Component {

  render () {
    const { schema, userComponents, userFunctions, name, version } = this.props;
    const { routes, pages, flows } = schema;
    const {store, history } = initStore(pages, name, version);
    if (!store) {
      return (
        <WarningComponent message="Redux store is not initialized." />
      );
    }
    window.__applicationBrowserHistory = history;
    clearActionsCache();
    const { actionSequences, targetProperties } = createActionSequences(flows, userFunctions);
    return (
      <Provider store={store}>
        <StartWrapper
          actionSequences={actionSequences}
          store={store}
        >
          <PageRouter
            history={history}
            routes={routes}
            pages={pages}
            userComponents={userComponents}
            actionSequences={actionSequences}
            targetProperties={targetProperties}
          />
        </StartWrapper>
      </Provider>
    );
  }
}

export default Application;