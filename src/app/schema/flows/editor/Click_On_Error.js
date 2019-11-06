export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
      componentInstance: 'resourceEditor1',
    },
    events: [
      {
        name: 'onErrorClick',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.appInitializationMethods.showMultipleErrorsNotification',
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
];
