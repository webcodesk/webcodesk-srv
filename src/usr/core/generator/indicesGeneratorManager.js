import path from 'path-browserify';
import { getIndexObjectFileText } from './fileTemplates';
import constants from '../../../commons/constants';
import {
  repairPath,
  writeFileWhenDifferent
} from '../utils/fileUtils';

function createIndexObject (resourceModel) {
  const { children } = resourceModel;
  let resultObject = {};
  let childrenArray = children;
  if (childrenArray && childrenArray.length > 0) {
    childrenArray.forEach(child => {
      const { type: childType, props: childProps } = child;
      if (childType === constants.GRAPH_MODEL_DIR_TYPE) {
        resultObject[childProps.name] = createIndexObject(child);
      } else if (childType === constants.GRAPH_MODEL_FILE_TYPE) {
        if (childProps.resourceType === constants.RESOURCE_IN_USER_FUNCTIONS_TYPE) {
          resultObject[childProps.name] = `require('${childProps.importPath}')`;
        } else if (childProps.resourceType === constants.RESOURCE_IN_COMPONENTS_TYPE) {
          resultObject[childProps.name] = `require('${childProps.importPath}').default`;
        }
      }
    });
  }
  return resultObject;
}

export function generateFiles (resourceTrees, appIndicesDirPath) {
  let sequence = Promise.resolve();
  if (resourceTrees && resourceTrees.length > 0) {
    resourceTrees.forEach(resourceTree => {
      sequence = sequence.then(() => {
        const indexObject = createIndexObject(resourceTree.tree);
        const fileBody = getIndexObjectFileText({indexObject});
        const filePath = repairPath(path.join(appIndicesDirPath, `${resourceTree.indexDirName}.js`));
        return writeFileWhenDifferent(filePath, fileBody);
      });
    });
  }
  return sequence;
}
