import path from 'path-browserify';
import { readDir } from 'usr/core/utils/dirUtils';
import { repairPath, readFile } from 'usr/core/utils/fileUtils';
import { findFunctionDeclarations } from './functionsParser';
import { findComponentDeclarations } from './componentsParser';
import { findPropTypesDeclarations } from './propTypesParser';
import { findPageDeclarations } from './pagesParser';
import { findFlowDeclarations } from './flowsParser';
import { findTemplateDeclarations } from './templatesParser';
import { findMarkdownDeclarations } from './markdownParser';
import * as config from '../config/config';
import constants  from '../../../commons/constants';
import { isFile } from '../utils/fileUtils';
import DeclarationsInFile from './DeclarationsInFile';

const validFileExtensions = {
  '.js': true, '.jsx': true, '.ts': true, '.tsx': true, '.json': true, '.md': true,
};

const componentFileSuffix = '.comp';
const userFunctionsFileSuffix = '.funcs';
const propTypesFileSuffix = '.props';
const markdownFileExtension = '.md';

export const createEmptyResource = (filePath) => {
  return [
    new DeclarationsInFile(
      constants.RESOURCE_IN_USER_FUNCTIONS_TYPE,
      [],
      filePath
    ),
    new DeclarationsInFile(
      constants.RESOURCE_IN_COMPONENTS_TYPE,
      [],
      filePath
    ),
    new DeclarationsInFile(
      constants.RESOURCE_IN_PAGES_TYPE,
      [],
      filePath
    ),
    new DeclarationsInFile(
      constants.RESOURCE_IN_FLOWS_TYPE,
      [],
      filePath
    ),
    new DeclarationsInFile(
      constants.RESOURCE_IN_PROP_TYPES_TYPE,
      [],
      filePath
    ),
    new DeclarationsInFile(
      constants.RESOURCE_IN_MARKDOWN_TYPE,
      [],
      filePath
    ),
    new DeclarationsInFile(
      constants.RESOURCE_IN_TEMPLATES_TYPE,
      [],
      filePath
    )
  ];
};

/**
 *
 * @param filePath
 * @param fileData
 * @returns {*}
 */
const parseFileData = (filePath, fileData) => {
  const result = [];
  const extName = path.extname(filePath);
  if (validFileExtensions[extName]) {
    if (filePath.indexOf(config.usrSourceDir) === 0) {
      const baseName = path.basename(filePath, extName);
      if (baseName.endsWith(propTypesFileSuffix)){
        result.push(new DeclarationsInFile(
          constants.RESOURCE_IN_PROP_TYPES_TYPE,
          findPropTypesDeclarations(fileData, config.projectRootSourceDir, filePath),
          filePath
        ));
      } else if (baseName.endsWith(componentFileSuffix)){
        result.push(new DeclarationsInFile(
          constants.RESOURCE_IN_COMPONENTS_TYPE,
          findComponentDeclarations(
            fileData,
            config.projectRootSourceDir,
            filePath,
            // component source file should have the same name as the component inside
            baseName.replace(componentFileSuffix, '')
          ),
          filePath
        ));
      } else if (baseName.endsWith(userFunctionsFileSuffix)){
        result.push(new DeclarationsInFile(
          constants.RESOURCE_IN_USER_FUNCTIONS_TYPE,
          findFunctionDeclarations(fileData, config.projectRootSourceDir, filePath),
          filePath
        ));
      } else if (extName === markdownFileExtension){
        result.push(new DeclarationsInFile(
          constants.RESOURCE_IN_MARKDOWN_TYPE,
          findMarkdownDeclarations(fileData),
          filePath
        ));
      }
    } else if (filePath.indexOf(config.etcPagesSourceDir) === 0) {
      result.push(new DeclarationsInFile(
        constants.RESOURCE_IN_PAGES_TYPE,
        findPageDeclarations(fileData),
        filePath
      ));
    } else if (filePath.indexOf(config.etcFlowsSourceDir) === 0) {
      result.push(new DeclarationsInFile(
        constants.RESOURCE_IN_FLOWS_TYPE,
        findFlowDeclarations(fileData),
        filePath
      ));
    } else if (filePath.indexOf(config.etcTemplatesSourceDir) === 0) {
      result.push(new DeclarationsInFile(
        constants.RESOURCE_IN_TEMPLATES_TYPE,
        findTemplateDeclarations(fileData),
        filePath
      ));
    }
  }
  return result;
};

/**
 *
 * @param filePath
 * @returns Promise{filePath, functionDeclarations,  componentDeclarations}
 */
const parseFileAsync = (filePath) => {
  return readFile(filePath)
    .then(fileData => {
      return parseFileData(filePath, fileData);
    });
};

const parseDir = async (dirPath) => {
  let foundFiles;
  try {
    foundFiles = await readDir(dirPath);
  } catch (e) {
    console.error(e);
  }
  let declarationsInFiles = [];
  const parseFileTasks = [];
  if (foundFiles && foundFiles.length > 0) {
    foundFiles.forEach(foundFile => {
      parseFileTasks.push(
        parseFileAsync(repairPath(foundFile))
          .then(declarationsInFile => {
            declarationsInFiles = declarationsInFiles.concat(declarationsInFile);
          })
          .catch(err => console.error(`Error parsing of the file ${foundFile}: `, err))
      )
    });
  }
  await Promise.all(parseFileTasks);
  return declarationsInFiles;
};

const parseFile = (filePath) => {
  return parseFileAsync(filePath)
    .then(declarationsInFile => {
      return declarationsInFile;
    })
    .catch(err => console.error(`Error parsing of the file ${filePath}: `, err));
};

export const parseResource = async (resourcePath, resourceFileData = null) => {
  const validResourcePath = repairPath(resourcePath);
  let declarationsInFiles = null;
  if (resourceFileData) {
    declarationsInFiles = parseFileData(validResourcePath, resourceFileData);
  } else {
    const isFileResource = await isFile(validResourcePath);
    if (isFileResource) {
      declarationsInFiles = await parseFile(validResourcePath);
    } else {
      declarationsInFiles = await parseDir(validResourcePath);
    }
  }
  return declarationsInFiles;
};
