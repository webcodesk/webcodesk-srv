export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.layouts.NewProjectWizard.NewProjectWizard',
      componentInstance: 'newProjectWizard1',
    },
    events: [
      {
        name: 'onOpenMarket',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.newProjectWizardMethods.openMarket',
            },
            events: [
              {
                name: 'isOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                      componentInstance: 'marketBoardDialog1',
                      propertyName: 'isOpen'
                    },
                    events: [
                      {
                        name: 'onClose',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                              componentInstance: 'marketBoardDialog1',
                              propertyName: 'isOpen'
                            }
                          },
                        ]
                      },
                      {
                        name: 'onInstall',
                        targets: [
                          {
                            type: 'userFunction',
                            props: {
                              functionName: 'usr.api.newProjectWizardMethods.submitMarket',
                            },
                            events: [
                              {
                                name: 'isOpen',
                                targets: [
                                  {
                                    type: 'component',
                                    props: {
                                      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                                      componentInstance: 'marketBoardDialog1',
                                      propertyName: 'isOpen'
                                    }
                                  }
                                ]
                              },
                              {
                                name: 'data',
                                targets: [
                                  {
                                    type: 'component',
                                    props: {
                                      componentName: 'usr.components.layouts.NewProjectWizard.NewProjectWizard',
                                      componentInstance: 'newProjectWizard1',
                                      propertyName: 'data'
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
              },
              {
                name: 'projectsType',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
                      componentInstance: 'marketBoardDialog1',
                      propertyName: 'projectsType'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];