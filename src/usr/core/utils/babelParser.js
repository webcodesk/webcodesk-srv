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

import * as babel from '@babel/core';
import generate from '@babel/generator';
import presetReact from '@babel/preset-react';
import pluginProposalClassProperties from '@babel/plugin-proposal-class-properties';
import pluginSyntaxTypescript from '@babel/plugin-syntax-typescript';

export const getSourceAst = (sourceCode) => {
  const ast = babel.parse(sourceCode, {
    plugins: [
      pluginProposalClassProperties,
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
