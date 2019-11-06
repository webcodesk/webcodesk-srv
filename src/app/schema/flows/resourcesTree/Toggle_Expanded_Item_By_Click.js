export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
      componentInstance: 'resourcesTreeView1',
    },
    events: [
      {
        name: 'onToggleResourceTreeViewItem',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.toggleExpandedResourceKey',
            },
            events: [
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
            ]
          }
        ]
      }
    ]
  }
];