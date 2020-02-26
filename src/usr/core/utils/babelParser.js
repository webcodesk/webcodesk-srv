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

import * as babel from '@babel/core';
import generate from '@babel/generator';
import presetReact from '@babel/preset-react';
import pluginProposalClassProperties from '@babel/plugin-proposal-class-properties';
import pluginSyntaxTypescript from '@babel/plugin-syntax-typescript';
import pluginSyntaxDynamicImport from '@babel/plugin-syntax-dynamic-import';

export const getSourceAst = (sourceCode) => {
  const ast = babel.parse(sourceCode, {
    plugins: [
      pluginProposalClassProperties,
      pluginSyntaxDynamicImport,
      [pluginSyntaxTypescript, { isTSX: true }],
    ],
    presets: [
      presetReact,
    ],
    // code: true,
    // ast: true,
    env: {},
    // ranges: false,
  });
  return ast.program;
};

export const generateSource = (ast, code) => {
  return generate(ast, {}, code);
};
