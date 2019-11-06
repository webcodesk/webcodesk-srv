import * as babel from '@babel/core';
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
