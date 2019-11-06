export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.SearchPanel.SearchPanel',
      componentInstance: 'searchPanel1',
    },
    events: [
      {
        name: 'onCancelSearchItems',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.cancelFindResourcesByText',
            },
            events: [
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