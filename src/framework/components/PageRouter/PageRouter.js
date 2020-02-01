import get from 'lodash/get';
import React from 'react';
import { Redirect, Router, Switch, Route } from 'react-router-dom';

import PageComposition from '../PageComposition';
import WarningComponent from '../WarningComponent';

const PageRouter = (props) => {
  const { routes, pages, userComponents, history, actionSequences, targetProperties } = props;
  if (!routes || routes.length === 0) {
    return (<WarningComponent message="Application does not have pages."/>);
  }
  const noMatchRoute = routes.find(r => r.pageName === 'noMatch');
  return (
    <Router history={history}>
      <Switch>
        {routes.map(route =>
          <Route
            key={`route_${route.path}`}
            exact
            path={route.path}
            render={
              ({ match, location }) =>
                <PageComposition
                  key={`page_${route.pageName}`}
                  userComponents={userComponents}
                  componentsTree={get(pages, route.pageName, {})}
                  actionSequences={actionSequences}
                  targetProperties={targetProperties}
                  routePath={route.path}
                  pageParams={match.params}
                  pageSearch={location.search}
                />
            }
          />
        )}
        {noMatchRoute
          && (
            <Route
              render={
                ({ match, location }) =>
                  <PageComposition
                    key={`page_${noMatchRoute.pageName}`}
                    userComponents={userComponents}
                    componentsTree={get(pages, noMatchRoute.pageName, {})}
                    actionSequences={actionSequences}
                    targetProperties={targetProperties}
                    routePath={noMatchRoute.path}
                    pageParams={match.params}
                    pageSearch={location.search}
                  />
              }
            />
          )
        }
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default PageRouter;