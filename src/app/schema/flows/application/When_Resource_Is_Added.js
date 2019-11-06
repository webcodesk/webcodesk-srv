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
      componentName: 'applicationStartWrapper',
      componentInstance: 'wrapperInstance',
    },
    events: [
      {
        name: 'onApplicationStart',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.appInitializationMethods.initApplication'
            },
            events: [
              {
                name: 'mainWindowMessage',
                targets: [
                  {
                    type: 'userFunction',
                    props: {
                      functionName: 'usr.api.mainWindowMessageMethods.processMainWindowMessage',
                    },
                    events: [
                      {
                        name: 'resourceAdded',
                        targets: [
                          {
                            type: 'userFunction',
                            props: {
                              functionName: 'usr.api.mainWindowMessageMethods.readResource',
                            },
                            events: [
                              {
                                name: 'success',
                                targets: [
                                  {
                                    type: 'userFunction',
                                    props: {
                                      functionName: 'usr.api.resourcesTreeViewMethods.updateResourcesTreeView'
                                    },
                                    events: [
                                      {
                                        name: 'resourcesTreeViewObject',
                                        targets: [
                                          {
                                            type: 'component',
                                            props: {
                                              componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
                                              componentInstance: 'resourcesTreeView1',
                                              propertyName: 'resourcesTreeViewObject',
                                            }
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                  {
                                    type: 'userFunction',
                                    props: {
                                      functionName: 'usr.api.resourceEditorMethods.updateAllTabs'
                                    },
                                    events: [
                                      {
                                        name: 'resourceEditorTabs',
                                        targets: [
                                          {
                                            type: 'component',
                                            props: {
                                              componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
                                              componentInstance: 'resourceEditor1',
                                              propertyName: 'resourceEditorTabs',
                                            }
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                ]
                              },
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
        ]
      }
    ]
  }
]