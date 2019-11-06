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
