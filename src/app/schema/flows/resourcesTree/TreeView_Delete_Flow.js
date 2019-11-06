export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
      componentInstance: 'resourcesTreeView1',
    },
    events: [
      {
        name: 'onDeleteFlow',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.removeFlowStart',
            },
            events: [
              {
                name: 'isDialogOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.DeleteFlowDialog.DeleteFlowDialog',
                      componentInstance: 'deleteFlowDialog1',
                      propertyName: 'isOpen'
                    },
                    events: [
                      {
                        name: 'onClose',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.dialogs.DeleteFlowDialog.DeleteFlowDialog',
                              componentInstance: 'deleteFlowDialog1',
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
                      componentName: 'usr.components.dialogs.DeleteFlowDialog.DeleteFlowDialog',
                      componentInstance: 'deleteFlowDialog1',
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
                      componentName: 'usr.components.dialogs.DeleteFlowDialog.DeleteFlowDialog',
                      componentInstance: 'deleteFlowDialog1',
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