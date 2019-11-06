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
              }
            ]
          }
        ]
      }
    ]
  }
]