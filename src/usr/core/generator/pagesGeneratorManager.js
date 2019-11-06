import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import constants from '../../../commons/constants';
import { getArrayDefaultExportFileText } from './fileTemplates';
import { writeFileWhenDifferent } from '../utils/fileUtils';

export function createComponentsTree(model, rootModelProps) {
  if (model && model.props) {
    const {
      type,
      children,
      props: {componentName, componentInstance, propertyName, propertyValue}
    } = model;
    if (type === constants.PAGE_COMPONENT_TYPE) {
      let newComponentModel = {
        type: componentName,
        instance: componentInstance,
        props: {}
      };
      if (children && children.length > 0) {
        children.forEach(child => {
          newComponentModel.props = createComponentsTree(child, newComponentModel.props);
        });
      }
      if (rootModelProps) {
        if (propertyName) {
          // component assigned to some named property in the
          rootModelProps[propertyName] = newComponentModel;
        } else {
          rootModelProps.push(newComponentModel);
        }
      } else {
        rootModelProps = newComponentModel;
      }
    } else if (type === constants.COMPONENT_PROPERTY_ARRAY_TYPE
      || type === constants.COMPONENT_PROPERTY_OBJECT_TYPE) {
      if (rootModelProps) {
        if (propertyName) {
          if (propertyValue) {
            rootModelProps[propertyName] = cloneDeep(propertyValue);
          } else {
            rootModelProps[propertyName] = null;
          }
        } else {
          // rootModelProps = rootModelProps || [];
          if (propertyValue) {
            rootModelProps = cloneDeep(propertyValue);
          }
        }
      }
    } else if (type === constants.COMPONENT_PROPERTY_ELEMENT_TYPE) {
      if (rootModelProps) {
        if (propertyName) {
          rootModelProps[propertyName] = null;
        }
      } else {
        rootModelProps = {};
      }
    } else if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
      let newObjectModel = {};
      if (children && children.length > 0) {
        children.forEach(child => {
          newObjectModel = createComponentsTree(child, newObjectModel);
        });
      }
      if (rootModelProps) {
        if (propertyName) {
          rootModelProps[propertyName] = newObjectModel;
        } else {
          rootModelProps.push(newObjectModel);
        }
      }
    } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
      let newArrayModel = [];
      if (children && children.length > 0) {
        children.forEach(child => {
          newArrayModel = createComponentsTree(child, newArrayModel);
        });
      }
      if (rootModelProps) {
        if (propertyName) {
          rootModelProps[propertyName] = newArrayModel;
        } else {
          rootModelProps.push(newArrayModel);
        }
      }
    } else if (type === constants.COMPONENT_PROPERTY_STRING_TYPE
      || type === constants.COMPONENT_PROPERTY_ONE_OF_TYPE
      || type === constants.COMPONENT_PROPERTY_SYMBOL_TYPE
      || type === constants.COMPONENT_PROPERTY_BOOL_TYPE
      || type === constants.COMPONENT_PROPERTY_ANY_TYPE
      || type === constants.COMPONENT_PROPERTY_NUMBER_TYPE) {
      if (rootModelProps) {
        if (propertyName) {
          rootModelProps[propertyName] = propertyValue || null;
        } else {
          if (propertyValue) {
            rootModelProps.push(propertyValue);
          }
        }
      }
    }
  }
  return rootModelProps;
}

export function createIndexObject (resourceModel, resultObject = {}, replaceImportDir) {
  if (resourceModel) {
    const { type, props, children } = resourceModel;
    if (type === constants.GRAPH_MODEL_FILE_TYPE) {
      const schemaImportPath = props && props.indexImportPath
        ? props.indexImportPath.replace(replaceImportDir, '')
        : null;
      if (schemaImportPath && schemaImportPath.length > 0 && children && children.length > 0) {
        const indexObjectKey =
          schemaImportPath.replace(constants.FILE_SEPARATOR_REGEXP, constants.MODEL_KEY_SEPARATOR);
        if (children && children.length > 0) {
          const { type: pageType, props: pageProps } = children[0];
          if (pageType === constants.GRAPH_MODEL_PAGE_TYPE && pageProps) {
            const { componentsTree } = pageProps;
            const fileData = createComponentsTree(componentsTree);
            set(resultObject, indexObjectKey, fileData);
          }
        }
      }
    } else if (children && children.length > 0) {
      children.forEach(child => {
        createIndexObject(child, resultObject, replaceImportDir);
      });
    }
  }
}

export function makeRouterItemsData (resourceModel) {
  let resultItems = [];
  if (resourceModel) {
    const { type, props, children } = resourceModel;
    if (type === constants.GRAPH_MODEL_PAGE_TYPE) {
      let path = `${constants.FILE_SEPARATOR}${props.pagePath}/:parameter?`;
      const pageName =
        `${props.pagePath.replace(constants.FILE_SEPARATOR_REGEXP, constants.MODEL_KEY_SEPARATOR)}`;
      resultItems.push({
        path,
        pageName,
      });
    } else if (children && children.length > 0) {
      children.forEach(child => {
        resultItems = resultItems.concat(makeRouterItemsData(child));
      });
    }
  }
  return resultItems;
}

export function generateFiles (resourcesTrees, destDirPath, replaceImportDir) {
  const indexObject = {};
  createIndexObject(resourcesTrees, indexObject, `${replaceImportDir}/`);
  const filePath = `${destDirPath}.js`;
  const fileBody = getArrayDefaultExportFileText({fileData: indexObject});
  return writeFileWhenDifferent(filePath, fileBody);
}

export function generateRoutesFile (resourcesTrees, destFilePath) {
  const routerItems = makeRouterItemsData(resourcesTrees);
  if (routerItems && routerItems.length > 0) {
    const foundIndexRoute = routerItems.find(i => i.pageName === 'main');
    const foundHomeRoute = routerItems.find(i => i.path === '/');
    if (!foundHomeRoute) {
      if (foundIndexRoute) {
        routerItems.unshift({
          path: '/',
          pageName: foundIndexRoute.pageName,
        });
      } else {
        routerItems.unshift({
          path: '/',
          pageName: routerItems[0].pageName,
        });
      }
    } else {
      if (foundIndexRoute) {
        foundHomeRoute.pageName = foundIndexRoute.pageName;
      } else {
        routerItems.unshift({
          path: '/',
          pageName: routerItems[0].pageName,
        });
      }
    }
  }
  const filePath = destFilePath;
  const fileBody = getArrayDefaultExportFileText({ fileData: routerItems });
  return writeFileWhenDifferent(filePath, fileBody)
    .catch(error => {
      console.error(`Can not create router file: "${filePath}" `, error);
    });
}
