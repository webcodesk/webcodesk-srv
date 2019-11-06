export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
      componentInstance: 'marketBoardDialog1',
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
      },
    ]
  }
]