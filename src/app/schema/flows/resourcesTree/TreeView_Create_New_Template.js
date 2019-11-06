export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
      componentInstance: 'resourcesTreeView1',
    },
    events: [
      {
        name: 'onCreateTemplate',
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
              }
            ]
          }
        ]
      }
    ]
  }
]