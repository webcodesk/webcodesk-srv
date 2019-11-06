import isString from 'lodash/isString';

export function findTemplateDeclarations(sourceCode) {
  const declarations = [];
  try {
    const templateJSON = isString(sourceCode) ? JSON.parse(sourceCode) : sourceCode;
    const { templateName, componentsTree } = templateJSON;
    const templateDeclaration = {
      templateName,
      componentsTree,
    };
    declarations.push(templateDeclaration);
  } catch(e) {
    console.error('Parsing the template source code: ', e);
    // do nothing...
  }
  return declarations;
}
