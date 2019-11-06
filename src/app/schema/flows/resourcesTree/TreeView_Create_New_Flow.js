export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
      componentInstance: 'resourcesTreeView1',
    },
    events: [
      {
        name: 'onCreateFlow',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.createNewFlowStart',
            },
            events: [
              {
                name: 'isDialogOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.NewFlowDialog.NewFlowDialog',
                      componentInstance: 'newFlowDialog1',
                      propertyName: 'isOpen'
                    },
                    events: [
                      {
                        name: 'onClose',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.dialogs.NewFlowDialog.NewFlowDialog',
                              componentInstance: 'newFlowDialog1',
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
                      componentName: 'usr.components.dialogs.NewFlowDialog.NewFlowDialog',
                      componentInstance: 'newFlowDialog1',
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