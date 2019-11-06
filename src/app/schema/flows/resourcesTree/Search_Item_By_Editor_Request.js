export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
      componentInstance: 'resourceEditor1',
    },
    events: [
      {
        name: 'onSearchRequest',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourcesTreeViewMethods.findResourcesByEditorRequest',
            },
            events: [
              {
                name: 'searchText',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.panels.SearchPanel.SearchPanel',
                      componentInstance: 'searchPanel1',
                      propertyName: 'searchText',
                    },
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