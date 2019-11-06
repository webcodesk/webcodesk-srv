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
      componentName: 'usr.components.layouts.ProjectLayout.ProjectLayout',
      componentInstance: 'projectLayout1',
    },
    events: [
      {
        name: 'onUnmount',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.starterLayoutMethods.closeExistingProject',
            },
            events: [
              {
                name: 'activeEditorTabIndex',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
                      componentInstance: 'resourceEditor1',
                      propertyName: 'activeEditorTabIndex',
                    },
                  }
                ]
              },
              {
                name: 'resourceEditorTabs',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
                      componentInstance: 'resourceEditor1',
                      propertyName: 'resourceEditorTabs',
                    },
                  }
                ]
              },
              {
                name: 'selectedResourceKey',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
                      componentInstance: 'resourcesTreeView1',
                      propertyName: 'selectedResourceKey',
                    }
                  }
                ]
              },
              {
                name: 'selectedResource',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
                      componentInstance: 'resourcesTreeView1',
                      propertyName: 'selectedResource',
                    }
                  }
                ]
              },
              {
                name: 'selectedVirtualPath',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
                      componentInstance: 'resourcesTreeView1',
                      propertyName: 'selectedVirtualPath',
                    }
                  }
                ]
              },
            ]
          }
        ]
      }
    ]
  },
];
