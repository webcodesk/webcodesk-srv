export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.dialogs.WelcomeDialog.WelcomeDialog',
      componentInstance: 'welcomeDialog1',
    },
    events: [
      {
        name: 'onClose',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.starterLayoutMethods.closeWelcome'
            },
            events: [
              {
                name: 'showWelcomeDialog',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.WelcomeDialog.WelcomeDialog',
                      componentInstance: 'welcomeDialog1',
                      propertyName: 'isOpen'
                    },
                  }
                ]
              }
            ]
          },
        ]
      },
      {
        name: 'onSubmit',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.starterLayoutMethods.showTutorial'
            },
            events: [
              {
                name: 'showWelcomeDialog',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.WelcomeDialog.WelcomeDialog',
                      componentInstance: 'welcomeDialog1',
                      propertyName: 'isOpen'
                    },
                  }
                ]
              }
            ]
          },
        ]
      }
    ]
  }
];
