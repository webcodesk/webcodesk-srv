export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.dialogs.ProjectServerDialog.ProjectServerDialog',
      componentInstance: 'projectServerDialog1',
    },
    events: [
      {
        name: 'onSetServerPort',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.setProjectServerPort',
            },
            events: [
              {
                name: 'projectSettings',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.ProjectServerDialog.ProjectServerDialog',
                      componentInstance: 'projectServerDialog1',
                      propertyName: 'projectSettings'
                    },
                  }
                ]
              },
              {
                name: 'doUpdateAll',
                targets: [
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
                      },
                      {
                        name: 'activeEditorTabIndex',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
                              componentInstance: 'resourceEditor1',
                              propertyName: 'activeEditorTabIndex',
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
        ]
      }
    ]
  }
]