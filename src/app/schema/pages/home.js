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

export default {
  type: 'usr.components.layouts.StarterLayout.StarterLayout',
  instance: 'starterLayout1',
  props: {
    projectLayout: {
      type: 'usr.components.layouts.ProjectLayout.ProjectLayout',
      instance: 'projectLayout1',
      props: {
        leftPanel: {
          type: 'usr.components.panels.LeftContainer.LeftContainer',
          instance: 'leftContainer1',
          props: {
            topPanel: {
              type: 'usr.components.panels.LeftTopPanel.LeftTopPanel',
              instance: 'leftTopPanel1'
            },
            searchPanel: {
              type: 'usr.components.panels.SearchPanel.SearchPanel',
              instance: 'searchPanel1'
            },
            treeView: {
              type: 'usr.components.panels.ResourcesTreeView.ResourcesTreeView',
              instance: 'resourcesTreeView1'
            },
          }
        },
        centralPanel: {
          type: 'usr.components.editor.ResourceEditor.ResourceEditor',
          instance: 'resourceEditor1'
        }
      }
    },
    newProjectWizard: {
      type: 'usr.components.layouts.NewProjectWizard.NewProjectWizard',
      instance: 'newProjectWizard1',
    }
  },
  children: [
    {
      type: 'usr.components.dialogs.SyslogDialog.SyslogDialog',
      instance: 'syslogDialog1'
    },
    {
      type: 'usr.components.dialogs.WelcomeDialog.WelcomeDialog',
      instance: 'welcomeDialog1'
    },
    {
      type: 'usr.components.dialogs.MarketBoardDialog.MarketBoardDialog',
      instance: 'marketBoardDialog1'
    },
    {
      type: 'usr.components.dialogs.NewFlowDialog.NewFlowDialog',
      instance: 'newFlowDialog1'
    },
    {
      type: 'usr.components.dialogs.CopyFlowDialog.CopyFlowDialog',
      instance: 'copyFlowDialog1'
    },
    {
      type: 'usr.components.dialogs.NewPageDialog.NewPageDialog',
      instance: 'newPageDialog1'
    },
    {
      type: 'usr.components.dialogs.NewTemplateDialog.NewTemplateDialog',
      instance: 'newTemplateDialog1'
    },
    {
      type: 'usr.components.dialogs.CopyPageDialog.CopyPageDialog',
      instance: 'copyPageDialog1'
    },
    {
      type: 'usr.components.dialogs.CopyTemplateDialog.CopyTemplateDialog',
      instance: 'copyTemplateDialog1'
    },
    {
      type: 'usr.components.dialogs.DeletePageDialog.DeletePageDialog',
      instance: 'deletePageDialog1'
    },
    {
      type: 'usr.components.dialogs.DeleteFlowDialog.DeleteFlowDialog',
      instance: 'deleteFlowDialog1'
    },
    {
      type: 'usr.components.dialogs.DeleteTemplateDialog.DeleteTemplateDialog',
      instance: 'deleteTemplateDialog1'
    },
    {
      type: 'usr.components.dialogs.ProjectServerDialog.ProjectServerDialog',
      instance: 'projectServerDialog1'
    },
    {
      type: 'usr.components.dialogs.SyslogDialog.SyslogDialog',
      instance: 'syslogDialog1'
    },
    {
      type: 'usr.components.dialogs.ComponentScaffoldDialog.ComponentScaffoldDialog',
      instance: 'componentScaffoldDialog1'
    },
    {
      type: 'usr.components.dialogs.FunctionsScaffoldDialog.FunctionsScaffoldDialog',
      instance: 'functionsScaffoldDialog1'
    },
    {
      type: 'usr.components.dialogs.InstallPackageDialog.InstallPackageDialog',
      instance: 'installPackageDialog1'
    }
  ]
};
