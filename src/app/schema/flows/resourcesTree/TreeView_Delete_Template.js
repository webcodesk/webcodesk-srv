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