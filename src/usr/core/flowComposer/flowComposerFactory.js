import {
  createDefaultFlowModel,
  createFlowModelForComponent,
  createFlowModelForFunction,
  createFlowModelForPage
} from './flowModelCreators';

const DEFAULT_MODEL = 'DEFAULT_MODEL';
const COMPONENT_MODEL = 'COMPONENT_MODEL';
const USER_FUNCTION_MODEL = 'USER_FUNCTION_MODEL';
const PAGE_MODEL = 'PAGE_MODEL';

const creators = {
  [DEFAULT_MODEL]: createDefaultFlowModel,
  [COMPONENT_MODEL]: createFlowModelForComponent,
  [USER_FUNCTION_MODEL]: createFlowModelForFunction,
  [PAGE_MODEL]: createFlowModelForPage,
};

export function createDefaultModel() {

  return creators[DEFAULT_MODEL]();
}

export function createFlowModel(resourceObject, inBasket) {
  if (resourceObject.isFlowComponentInstance || resourceObject.isComponentInstance) {
    if (!resourceObject.componentName || !resourceObject.componentInstance) {
      throw Error('FlowComposerFactory.createFlowModel: the dropped component is missing a component name, or a component instance name');
    }
    return creators[COMPONENT_MODEL](resourceObject, inBasket);
  } else if (resourceObject.isUserFunction || resourceObject.isFlowUserFunction) {
    if (!resourceObject.functionName) {
      throw Error('FlowComposerFactory.createFlowModel: the dropped user function misses name');
    }
    return creators[USER_FUNCTION_MODEL](resourceObject, inBasket);
  } else if (resourceObject.isPage || resourceObject.isFlowPage) {
    return creators[PAGE_MODEL](resourceObject, inBasket);
  }
  return null;
}