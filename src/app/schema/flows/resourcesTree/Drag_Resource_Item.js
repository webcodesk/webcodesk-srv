export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
      componentInstance: 'resourcesTreeView1',
    },
    events: [
      {
        name: 'onItemDragStart',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourceEditorMethods.resourceItemDragStart',
            },
            events: [
              {
                name: 'draggedItem',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
                      componentInstance: 'resourceEditor1',
                      propertyName: 'draggedItem',
                    },
                  }
                ]
              },
              {
                name: 'isDraggingItem',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
                      componentInstance: 'resourceEditor1',
                      propertyName: 'isDraggingItem',
                    },
                  }
                ]
              },
            ]
          }
        ]
      },
      {
        name: 'onItemDragEnd',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourceEditorMethods.resourceItemDragEnd',
            },
            events: [
              {
                name: 'isDraggingItem',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
                      componentInstance: 'resourceEditor1',
                      propertyName: 'isDraggingItem',
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