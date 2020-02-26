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
import <%= flowsFileName %> from './<%= flowsFileName %>';
import <%= pagesFileName %> from './<%= pagesFileName %>';
import <%= routerFileName %> from './<%= routerFileName %>';
export default {
  <%= flowsFileName %>,
  <%= pagesFileName %>,
  <%= routerFileName %>,
  appMode: '<%= appMode %>', 
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