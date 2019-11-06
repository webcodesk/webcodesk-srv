export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.dialogs.ProjectServerDialog.ProjectServerDialog',
      componentInstance: 'projectServerDialog1',
    },
    events: [
      {
        name: 'onRestartServer',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.restartProjectServer',
            },
          }
        ]
      }
    ]
  }
]