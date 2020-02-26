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
      componentName: 'usr.components.layouts.NewProjectWizard.NewProjectWizard',
      componentInstance: 'newProjectWizard1',
    },
    events: [
      {
        name: 'onOpenMarket',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.newProjectWizardMethods.openMarket',
            },
            events: [
              {
                name: 'isOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                      componentInstance: 'marketBoardDialog1',
                      propertyName: 'isOpen'
                    },
                    events: [
                      {
                        name: 'onClose',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                              componentInstance: 'marketBoardDialog1',
                              propertyName: 'isOpen'
                            }
                          },
                        ]
                      },
                      {
                        name: 'onInstall',
                        targets: [
                          {
                            type: 'userFunction',
                            props: {
                              functionName: 'usr.api.newProjectWizardMethods.submitMarket',
                            },
                            events: [
                              {
                                name: 'isOpen',
                                targets: [
                                  {
                                    type: 'component',
                                    props: {
                                      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                                      componentInstance: 'marketBoardDialog1',
                                      propertyName: 'isOpen'
                                    }
                                  }
                                ]
                              },
                              {
                                name: 'data',
                                targets: [
                                  {
                                    type: 'component',
                                    props: {
                                      componentName: 'usr.components.layouts.NewProjectWizard.NewProjectWizard',
                                      componentInstance: 'newProjectWizard1',
                                      propertyName: 'data'
                                    }
                                  }
                                ]
                              }
                            ]
                          },
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'projectsType',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                      componentInstance: 'marketBoardDialog1',
                      propertyName: 'projectsType'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];