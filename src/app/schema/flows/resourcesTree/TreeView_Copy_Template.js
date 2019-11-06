export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
      componentInstance: 'resourcesTreeView1',
    },
    events: [
      {
        name: 'onCopyTemplate',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.copyTemplateStart',
            },
            events: [
              {
                name: 'isDialogOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.CopyTemplateDialog.CopyTemplateDialog',
                      componentInstance: 'copyTemplateDialog1',
                      propertyName: 'isOpen'
                    },
                    events: [
                      {
                        name: 'onClose',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.dialogs.CopyTemplateDialog.CopyTemplateDialog',
                              componentInstance: 'copyTemplateDialog1',
                              propertyName: 'isOpen'
                            },
                          }
                        ]
                      }
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
                      componentName: 'usr.components.dialogs.CopyTemplateDialog.CopyTemplateDialog',
                      componentInstance: 'copyTemplateDialog1',
                      propertyName: 'pageResource'
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
                      componentName: 'usr.components.dialogs.CopyTemplateDialog.CopyTemplateDialog',
                      componentInstance: 'copyTemplateDialog1',
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