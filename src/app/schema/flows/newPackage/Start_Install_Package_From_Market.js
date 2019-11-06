export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.LeftTopPanel.LeftTopPanel',
      componentInstance: 'leftTopPanel1',
    },
    events: [
      {
        name: 'onInstallPackage',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.newPackageMethods.startInstallPackage',
            },
            events: [
              {
                name: 'isOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.InstallPackageDialog.InstallPackageDialog',
                      componentInstance: 'installPackageDialog1',
                      propertyName: 'isOpen'
                    },
                    events: [
                      {
                        name: 'onClose',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.dialogs.InstallPackageDialog.InstallPackageDialog',
                              componentInstance: 'installPackageDialog1',
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
                name: 'data',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.InstallPackageDialog.InstallPackageDialog',
                      componentInstance: 'installPackageDialog1',
                      propertyName: 'data'
                    },
                  }
                ]
              },
              {
                name: 'error',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.InstallPackageDialog.InstallPackageDialog',
                      componentInstance: 'installPackageDialog1',
                      propertyName: 'error'
                    },
                  }
                ]
              },
            ]
          }
        ]
      }
    ]
  }
]