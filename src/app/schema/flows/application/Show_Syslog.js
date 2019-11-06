export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.LeftTopPanel.LeftTopPanel',
      componentInstance: 'leftTopPanel1',
    },
    events: [
      {
        name: 'onShowSyslog',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.mainWindowMessageMethods.getSyslog',
            },
            events: [
              {
                name: 'isOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.SyslogDialog.SyslogDialog',
                      componentInstance: 'syslogDialog1',
                      propertyName: 'isOpen',
                    },
                    events: [
                      {
                        name: 'onClose',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.dialogs.SyslogDialog.SyslogDialog',
                              componentInstance: 'syslogDialog1',
                              propertyName: 'isOpen',
                            },
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'sysLog',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.SyslogDialog.SyslogDialog',
                      componentInstance: 'syslogDialog1',
                      propertyName: 'sysLog',
                    },
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