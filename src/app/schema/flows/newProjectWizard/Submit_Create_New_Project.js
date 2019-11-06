export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.layouts.NewProjectWizard.NewProjectWizard',
      componentInstance: 'newProjectWizard1',
    },
    events: [
      {
        name: 'onSubmit',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.newProjectWizardMethods.createNewProjectSubmit',
            },
            events: [
              {
                name: 'installerFeedback',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.layouts.NewProjectWizard.NewProjectWizard',
                      componentInstance: 'newProjectWizard1',
                      propertyName: 'installerFeedback'
                    },
                  }
                ]
              },
              {
                name: 'creatingError',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.layouts.NewProjectWizard.NewProjectWizard',
                      componentInstance: 'newProjectWizard1',
                      propertyName: 'creatingError'
                    },
                  }
                ]
              },
              {
                name: 'projectCreated',
                targets: [
                  {
                    type: 'userFunction',
                    props: {
                      functionName: 'usr.api.starterLayoutMethods.testProjectConfiguration'
                    },
                    events: [
                      {
                        name: 'projectConfigStatus',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.layouts.StarterLayout.StarterLayout',
                              componentInstance: 'starterLayout1',
                              propertyName: 'projectConfigStatus',
                            }
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
      }
    ]
  }
];