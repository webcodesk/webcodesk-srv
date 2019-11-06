export default [
  {
    type: 'component',
    props: {
      componentName: 'applicationStartWrapper',
      componentInstance: 'wrapperInstance',
    },
    events: [
      {
        name: 'onApplicationStart',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.appInitializationMethods.initApplication'
            },
            events: [
              {
                name: 'mainWindowMessage',
                targets: [
                  {
                    type: 'userFunction',
                    props: {
                      functionName: 'usr.api.mainWindowMessageMethods.processMainWindowMessage',
                    },
                    events: [
                      {
                        name: 'projectServerStatus',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.panels.LeftTopPanel.LeftTopPanel',
                              componentInstance: 'leftTopPanel1',
                              propertyName: 'projectServerStatus'
                            },
                          },
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.dialogs.ProjectServerDialog.ProjectServerDialog',
                              componentInstance: 'projectServerDialog1',
                              propertyName: 'projectServerStatus'
                            },
                          }
                        ]
                      },
                      {
                        name: 'projectServerLog',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.dialogs.ProjectServerDialog.ProjectServerDialog',
                              componentInstance: 'projectServerDialog1',
                              propertyName: 'projectServerLog'
                            },
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
        ]
      }
    ]
  }
]