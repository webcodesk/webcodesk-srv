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
      componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
      componentInstance: 'resourceEditor1',
    },
    events: [
      {
        name: 'onSaveAsTemplate',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.createNewTemplateStart',
            },
            events: [
              {
                name: 'isDialogOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.NewTemplateDialog.NewTemplateDialog',
                      componentInstance: 'newTemplateDialog1',
                      propertyName: 'isOpen'
                    },
                  }
                ]
              },
              {
                name: 'dirPath',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.NewTemplateDialog.NewTemplateDialog',
                      componentInstance: 'newTemplateDialog1',
                      propertyName: 'dirPath'
                    },
                  }
                ]
              },
              {
                name: 'templateModel',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.NewTemplateDialog.NewTemplateDialog',
                      componentInstance: 'newTemplateDialog1',
                      propertyName: 'templateModel'
                    },
                  }
                ]
              },
              {
                name: 'isNewInstance',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.NewTemplateDialog.NewTemplateDialog',
                      componentInstance: 'newTemplateDialog1',
                      propertyName: 'isNewInstance'
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