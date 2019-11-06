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
      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
      componentInstance: 'resourcesTreeView1',
    },
    events: [
      {
        name: 'onDeleteTemplate',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.removeTemplateStart',
            },
            events: [
              {
                name: 'isDialogOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.DeleteTemplateDialog.DeleteTemplateDialog',
                      componentInstance: 'deleteTemplateDialog1',
                      propertyName: 'isOpen'
                    },
                    events: [
                      {
                        name: 'onClose',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.dialogs.DeleteTemplateDialog.DeleteTemplateDialog',
                              componentInstance: 'deleteTemplateDialog1',
                              propertyName: 'isOpen'
                            }
                          },
                        ]
                      },
                    ]
                  }
                ]
              },
              {
                name: 'resource',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.DeleteTemplateDialog.DeleteTemplateDialog',
                      componentInstance: 'deleteTemplateDialog1',
                      propertyName: 'resource'
                    },
                  }
                ]
              },
              {
                name: 'resourceName',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.DeleteTemplateDialog.DeleteTemplateDialog',
                      componentInstance: 'deleteTemplateDialog1',
                      propertyName: 'resourceName'
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