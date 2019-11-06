export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.dialogs.DeleteFlowDialog.DeleteFlowDialog',
      componentInstance: 'deleteFlowDialog1',
    },
    events: [
      {
        name: 'onSubmit',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.removeFlowSubmit',
            },
            events: [
              {
                name: 'isDialogOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.DeleteFlowDialog.DeleteFlowDialog',
                      componentInstance: 'deleteFlowDialog1',
                      propertyName: 'isOpen'
                    }
                  }
                ]
              },
              {
                name: 'deleteFilePath',
                targets: [
                  {
                    type: 'userFunction',
                    props: {
                      functionName: 'usr.api.mainWindowMessageMethods.deleteEtcFile',
                    },
                    events: [
                      {
                        name: 'success',
                        targets: [
                          {
                            type: 'userFunction',
                            props: {
                              functionName: 'usr.api.mainWindowMessageMethods.removeResource',
                            },
                            events: [
                              {
                                name: 'success',
                                targets: [
                                  {
                                    type: 'userFunction',
                                    props: {
                                      functionName: 'usr.api.resourcesTreeViewMethods.removeSelectedResource'
                                    },
                                    events: [
                                      {
                                        name: 'selectedResourceKey',
                                        targets: [
                                          {
                                            type: 'component',
                                            props: {
                                              componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
                                              componentInstance: 'resourcesTreeView1',
                                              propertyName: 'selectedResourceKey',
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
                                            }
                                          }
                                        ]
                                      },
                                      {
                                        name: 'selectedVirtualPath',
                                        targets: [
                                          {
                                            type: 'component',
                                            props: {
                                              componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
                                              componentInstance: 'resourcesTreeView1',
                                              propertyName: 'selectedVirtualPath',
                                            }
                                          }
                                        ]
                                      }
                                    ]
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
                                      },
                                      {
                                        name: 'activeEditorTabIndex',
                                        targets: [
                                          {
                                            type: 'component',
                                            props: {
                                              componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
                                              componentInstance: 'resourceEditor1',
                                              propertyName: 'activeEditorTabIndex',
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
                ],
              },
            ]
          }
        ]
      }
    ]
  }
]