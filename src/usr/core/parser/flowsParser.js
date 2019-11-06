import isString from 'lodash/isString';
import FlowComposerManager from '../flowComposer/FlowComposerManager';

// function isModelEqual (aModel, bModel) {
//   if (aModel && bModel) {
//     const { flowParticleType: aType } = aModel;
//     const { flowParticleType: bType } = bModel;
//     if (aType === bType) {
//       return (
//           aModel.functionName === bModel.functionName
//         )
//         && (
//           aModel.componentName === bModel.componentName
//           && aModel.componentInstance === bModel.componentInstance
//         )
//         && (
//           aModel.pageName === bModel.pageName
//           && aModel.pagePath === bModel.pagePath
//         );
//     }
//   }
//   return false;
// }

export function findFlowDeclarations (sourceCode) {
  const declarations = [];
  try {
    const pageJSON = isString(sourceCode) ? JSON.parse(sourceCode) : sourceCode;
    const { flowName, model, isDisabled } = pageJSON;
    const flowComposerManager = new FlowComposerManager(model);
    const flowDeclaration = {
      flowName,
      isDisabled,
      model,
      flowParticles: flowComposerManager.getFlowParticles(),
    };
    declarations.push(flowDeclaration);
  } catch (e) {
    console.error('Parsing the flow source code: ', e);
    // do nothing...
  }
  return declarations;
}
