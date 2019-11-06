export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.dialogs.CopyPageDialog.CopyPageDialog',
      componentInstance: 'copyPageDialog1',
    },
    events: [
      {
        name: 'onSubmit',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.copyPageSubmit',
            },
            events: [
              {
                name: 'isDialogOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.CopyPageDialog.CopyPageDialog',
                      componentInstance: 'copyPageDialog1',
                      propertyName: 'isOpen'
                    }
                  }
                ]
              },
              {
                name: 'selectedResource',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
                      componentInstance: 'resourcesTreeView1',
                      propertyName: 'selectedResource',
                    },
                  },
                ]
              },
              {
                name: 'selectedResourceKey',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
                      componentInstance: 'resourcesTreeView1',
                      propertyName: 'selectedResourceKey',
                    },
                  },
                  {
                    type: 'userFunction',
                    props: {
                      functionName: 'usr.api.resourceEditorMethods.openTabWithResourceByKey'
                    },
                    events: [
                      {
                        name: 'activeEditorTabIndex',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
                              componentInstance: 'resourceEditor1',
                              propertyName: 'activeEditorTabIndex',
                            },
                          }
                        ]
                      },
                      {
                        name: 'resourceEditorTabs',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
                              componentInstance: 'resourceEditor1',
                              propertyName: 'resourceEditorTabs',
                            },
                          }
                        ]
                      },                    ]
                  },
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
                  }
                ]
              },
              {
                name: 'expandedResourceKeys',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
                      componentInstance: 'resourcesTreeView1',
                      propertyName: 'expandedResourceKeys',
                    },
                  }
                ]
              },
              {
                name: 'resourceUpdatedSuccessfully',
                targets: [
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
              {
                name: 'fileObject',
                targets: [
                  {
                    type: 'userFunction',
                    props: {
                      functionName: 'usr.api.mainWindowMessageMethods.writeEtcFile'
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
                name: 'caughtException',
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
      }
    ]
  }
]