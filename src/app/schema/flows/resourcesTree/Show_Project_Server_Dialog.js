export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.LeftTopPanel.LeftTopPanel',
      componentInstance: 'leftTopPanel1',
    },
    events: [
      {
        name: 'onProjectServerDialog',
        targets: [
          {
            type: 'component',
            props: {
              componentName: 'usr.components.dialogs.ProjectServerDialog.ProjectServerDialog',
              componentInstance: 'projectServerDialog1',
              propertyName: 'isOpen'
            },
            events: [
              {
                name: 'onClose',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.ProjectServerDialog.ProjectServerDialog',
                      componentInstance: 'projectServerDialog1',
                      propertyName: 'isOpen'
                    },
                  }
                ]
              }
            ]
          },
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.getProjectSettings',
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
              }
            ]
          }
        ]
      }
    ]
  }
]