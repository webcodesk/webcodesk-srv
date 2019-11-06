import forOwn from 'lodash/forOwn';
import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';
import template from 'lodash/template';
// import prettier from 'prettier/standalone';
// import prettierBabylon from 'prettier/parser-babylon';

const indexFileTemplate = `<% if (importFiles && importFiles.length > 0) { %><% importFiles.forEach(function(value, index){ %><% if (value.membersListString && value.membersListString.length > 0) { %>import { <%= value.membersListString %> } from '<%= value.importPath %>';<%= '\\n' %><% } %><% if (value.defaultString && value.defaultString.length > 0) { %>import <%= value.defaultString %> from '<%= value.importPath %>';<%= '\\n' %><% } %><% }); %><% } %>export default {<% if (importFiles && importFiles.length > 0) { %><% importFiles.forEach(function(value, index){ %><% if (value.membersListString && value.membersListString.length > 0) { %><%= value.membersListString %>,<% } %><% if (value.defaultString && value.defaultString.length > 0) { %><%= value.defaultString %>,<% } %><% }); %><% } %>}`;

export function getIndexFileText(templateData) {
  const text = template(indexFileTemplate)(templateData);
  // return prettier.format(text, { parser: 'babylon', plugins: [prettierBabylon] });
  return text;
}

const schemaIndexFileTemplate = `
import <%= flowsDirName %> from './<%= flowsDirName %>';
import <%= pagesDirName %> from './<%= pagesDirName %>';
import <%= routerFileName %> from './<%= routerFileName %>';
export default {
  <%= flowsDirName %>,
  <%= pagesDirName %>,
  <%= routerFileName %>,
};
`;

export function getSchemaIndexFileText(templateData) {
  return template(schemaIndexFileTemplate)(templateData);
}

const arrayDefaultExportFileTemplate = `
export default <%= JSON.stringify(fileData) %>;
`;

export function getArrayDefaultExportFileText(templateData) {
  const text = template(arrayDefaultExportFileTemplate)(templateData);
  // return prettier.format(text, { parser: 'babylon', plugins: [prettierBabylon] });
  return text;
}

const indexObjectFileTemplate = `
export default <%= createLine(indexObject) %>;
`;

function createLine(obj) {
  let line = '{';
  if (obj) {
    forOwn(obj, (value, prop) => {
      if (value) {
        line += `'${prop}':`;
        if (isString(value)) {
          line += `${value},`;
        } else if (isPlainObject(value)) {
          line += `${createLine(value)},`
        }
      }
    });
  }
  line += '}';
  return line;
}

export function getIndexObjectFileText(templateData) {
  const text = template(indexObjectFileTemplate)({...templateData, createLine: createLine});
  // return prettier.format(text, { parser: 'babylon', plugins: [prettierBabylon] });
  return text;
}