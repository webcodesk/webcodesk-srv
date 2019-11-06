export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.dialogs.InstallPackageDialog.InstallPackageDialog',
      componentInstance: 'installPackageDialog1',
    },
    events: [
      {
        name: 'onSubmit',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.newPackageMethods.submitInstallPackage',
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
              {
                name: 'isLoading',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.InstallPackageDialog.InstallPackageDialog',
                      componentInstance: 'installPackageDialog1',
                      propertyName: 'isLoading'
                    },
                  }
                ]
              },
              {
                name: 'success',
                targets: [
                  {
                    type: 'userFunction',
                    props: {
                      functionName: 'usr.api.appInitializationMethods.showSuccessNotification'
                    },
                    events: [
                      {
                        name: 'notification',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.layouts.ProjectLayout.ProjectLayout',
                              componentInstance: 'projectLayout1',
                              propertyName: 'notification'
                            }
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
      },
    ]
  }
]
