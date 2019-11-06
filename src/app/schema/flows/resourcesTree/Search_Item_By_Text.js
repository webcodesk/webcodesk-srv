export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.SearchPanel.SearchPanel',
      componentInstance: 'searchPanel1',
    },
    events: [
      {
        name: 'onSearchItems',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.findResourcesByText',
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
              {
                name: 'foundResourceKeys',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
                      componentInstance: 'resourcesTreeView1',
                      propertyName: 'highlightedResourceKeys',
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