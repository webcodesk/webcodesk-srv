export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
      componentInstance: 'resourcesTreeView1',
    },
    events: [
      {
        name: 'onCreateFunctions',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.createNewFunctionsStart',
            },
            events: [
              {
                name: 'isDialogOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.FunctionsScaffoldDialog.FunctionsScaffoldDialog',
                      componentInstance: 'functionsScaffoldDialog1',
                      propertyName: 'isOpen'
                    },
                    events: [
                      {
                        name: 'onClose',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.dialogs.FunctionsScaffoldDialog.FunctionsScaffoldDialog',
                              componentInstance: 'functionsScaffoldDialog1',
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
                name: 'dirPath',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.FunctionsScaffoldDialog.FunctionsScaffoldDialog',
                      componentInstance: 'functionsScaffoldDialog1',
                      propertyName: 'dirPath'
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