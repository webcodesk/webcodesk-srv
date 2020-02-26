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

import * as projectInstallManager from '../market/projectInstallManager';
import * as config from '../config/config';

export async function createNewProject (options, feedback) {
  if (options && feedback) {
    const { newProjectModel } = options;
    let validDestDirPath;
    try {
       validDestDirPath = await config.getCurrentDirPath();
    } catch (e) {
      feedback({
        code: '1',
        message: 'I can not get the current dir path.'
      });
    }
    if (newProjectModel) {
      const { projectReleaseDownloadURL } = newProjectModel;
      if (!projectReleaseDownloadURL) {
        feedback({
          code: '1',
          message: 'The project\'s release download URL is not found.'
        });
      } else {
        try {

          feedback({
            code: 'log',
            message: `Downloading the release archive file: ${projectReleaseDownloadURL}`
          });
          const {
            packageConfig,
            packageFileList
          } = await projectInstallManager.downloadPackage(projectReleaseDownloadURL, validDestDirPath);
          feedback({
            code: 'log',
            message: 'The release archive file is downloaded successfully'
          });

          await projectInstallManager.writeNewPackageFile(packageConfig, validDestDirPath);

          feedback({
            code: 'log',
            message: 'Installing deps and the source code files...'
          });

          await projectInstallManager.installProject(packageFileList, validDestDirPath);

          await projectInstallManager.removeDownloadDir(validDestDirPath);

          feedback({
            code: 'log',
            message: 'The project successfully initialized'
          });

          feedback({
            code: '0',
            message: 'The project successfully initialized',
            newProjectDirPath: validDestDirPath,
          });

        } catch (e) {
          console.error(e);
          feedback({
            code: '1',
            message: `Error in creating a new project: ${e.message}`
          });
        }
      }
    }

  }
}

export async function installNewPackage (options) {
  if (options) {

    const { directoryName, projectModel } = options;

    if (projectModel) {
      const { projectReleaseDownloadURL } = projectModel;
      if (!projectReleaseDownloadURL) {
        throw Error('The project\'s release download URL is not found.');
      } else {

        const { packageFileList, packageDependencies, packageDevDependencies } =
          await projectInstallManager.downloadPackage(projectReleaseDownloadURL, config.projectDirPath);

        await projectInstallManager.installAsPackage(
          packageFileList, packageDependencies, packageDevDependencies, config.projectDirPath, directoryName
        );

        await projectInstallManager.removeDownloadDir(config.projectDirPath);

      }
    }

  }
}
