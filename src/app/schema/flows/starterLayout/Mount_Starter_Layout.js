export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.layouts.StarterLayout.StarterLayout',
      componentInstance: 'starterLayout1',
    },
    events: [
      {
        name: 'onMounted',
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
];
