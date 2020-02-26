/*
 *     Webcodesk
 *     Copyright (C) 2019  Oleksandr (Alex) Pustovalov
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
        leftMicroPanel: {
          type: 'usr.components.panels.LeftMicroPanel.LeftMicroPanel',
          instance: 'leftMicroPanel1',
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
    },
  ]
};
