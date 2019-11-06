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
                        name: 'resourceAdded',
                        targets: [
                          {
                            type: 'userFunction',
                            props: {
                              functionName: 'usr.api.mainWindowMessageMethods.readResource',
                            },
                            events: [
                              {
                                name: 'success',
                                targets: [
                                  {
                                    type: 'userFunction',
                                    props: {
                                      functionName: 'usr.api.resourcesTreeViewMethods.updateResourcesTreeView'
                                    },
                                    events: [
                                      {
                                        name: 'resourcesTreeViewObject',
                                        targets: [
                                          {
                                            type: 'component',
                                            props: {
                                              componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
                                              componentInstance: 'resourcesTreeView1',
                                              propertyName: 'resourcesTreeViewObject',
                                            }
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                  {
                                    type: 'userFunction',
                                    props: {
                                      functionName: 'usr.api.resourceEditorMethods.updateAllTabs'
                                    },
                                    events: [
                                      {
                                        name: 'resourceEditorTabs',
                                        targets: [
                                          {
                                            type: 'component',
                                            props: {
                                              componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
                                              componentInstance: 'resourceEditor1',
                                              propertyName: 'resourceEditorTabs',
                                            }
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                ]
                              },
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
        ]
      }
    ]
  }
]