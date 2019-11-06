export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
      componentInstance: 'resourceEditor1',
    },
    events: [
      {
        name: 'onOpenResource',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourceEditorMethods.openTabWithResourceByKey',
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
              },
            ]
          }
        ]
      }
    ]
  }
];