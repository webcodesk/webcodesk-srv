/*
 *    Copyright 2019 Alex (Oleksandr) Pustovalov
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

export default [
  {
    type: 'component',
    props: {
      componentName: 'usr.components.panels.LeftTopPanel.LeftTopPanel',
      componentInstance: 'leftTopPanel1',
    },
    events: [
      {
        name: 'onInstallPackage',
        targets: [
          {
            type: 'userFunction',
            props: {
              functionName: 'usr.api.newPackageMethods.startInstallPackage',
            },
            events: [
              {
                name: 'isOpen',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.InstallPackageDialog.InstallPackageDialog',
                      componentInstance: 'installPackageDialog1',
                      propertyName: 'isOpen'
                    },
                    events: [
                      {
                        name: 'onClose',
                        targets: [
                          {
                            type: 'component',
                            props: {
                              componentName: 'usr.components.dialogs.InstallPackageDialog.InstallPackageDialog',
                              componentInstance: 'installPackageDialog1',
                              propertyName: 'isOpen'
                            },
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'data',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.InstallPackageDialog.InstallPackageDialog',
                      componentInstance: 'installPackageDialog1',
                      propertyName: 'data'
                    },
                  }
                ]
              },
              {
                name: 'error',
                targets: [
                  {
                    type: 'component',
                    props: {
                      componentName: 'usr.components.dialogs.InstallPackageDialog.InstallPackageDialog',
                      componentInstance: 'installPackageDialog1',
                      propertyName: 'error'
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
]