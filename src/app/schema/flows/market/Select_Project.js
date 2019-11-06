/*
 *    Copyright 2019 Alex (Oleksandr) Pustovalov
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
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
        name: 'onSelectProject',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.marketMethods.selectProject',
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
            ]
          }
        ]
      },
    ]
  }
]