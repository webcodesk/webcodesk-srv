export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.editor.ResourceEditor.ResourceEditor',
      componentInstance: 'resourceEditor1',
    },
    events: [
      {
        name: 'onOpenUrl',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.resourceEditorMethods.openUrlInExternalBrowser',
            },
          }
        ]
      }
    ]
  }
];