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

export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
      componentInstance: 'marketBoardDialog1',
    },
    events: [
      {
        name: 'onSearch',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.marketMethods.findProjects',
            },
            events: [
              {
                name: 'isLoading',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                      componentInstance: 'marketBoardDialog1',
                      propertyName: 'isLoading'
                    },
                  }
                ]
              },
              {
                name: 'error',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                      componentInstance: 'marketBoardDialog1',
                      propertyName: 'error'
                    },
                  }
                ]
              },
              {
                name: 'selectedProject',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                      componentInstance: 'marketBoardDialog1',
                      propertyName: 'selectedProject'
                    },
                  }
                ]
              },
              {
                name: 'searchTagsList',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                      componentInstance: 'marketBoardDialog1',
                      propertyName: 'searchTagsList'
                    },
                  }
                ]
              },
              {
                name: 'projectsList',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                      componentInstance: 'marketBoardDialog1',
                      propertyName: 'projectsList'
                    },
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'onBackToSearch',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.marketMethods.openMarketBoard',
            },
            events: [
              {
                name: 'selectedProject',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                      componentInstance: 'marketBoardDialog1',
                      propertyName: 'selectedProject'
                    },
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]