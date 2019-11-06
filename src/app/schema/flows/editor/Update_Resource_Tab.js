export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
      componentInstance: 'resourceEditor1',
    },
    events: [
      {
        name: 'onUpdateEditorTab',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourceEditorMethods.updateResourceByTab',
            },
            events: [
              {
                name: 'fileObject',
                targets: [
                  {
                    type: 'userFunction',
                    props: {
                      functionName: 'usr.api.mainWindowMessageMethods.updateResource',
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
                  },
                  {
                    type: 'userFunction',
                    props: {
                      functionName: 'usr.api.mainWindowMessageMethods.writeEtcFile',
                    },
                    events: [
                      {
                        name: 'exception',
                        targets: [
                          {
                            type: 'userFunction',
                            props: {
                              functionName: 'usr.api.appInitializationMethods.showErrorNotification'
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
                      }
                    ]
                  }
                ]
              },
              {
                name: 'updateResourceHistory',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
                      componentInstance: 'resourceEditor1',
                      propertyName: 'updateResourceHistory'
                    },
                  }
                ]
              }
            ],
          }
        ]
      }
    ]
  }
];