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
