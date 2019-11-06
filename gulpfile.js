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

const del = require('del');
const babel = require('gulp-babel');
const { series, dest, src } = require('gulp');
const jsObfuscator = require('gulp-javascript-obfuscator');

function clean(){
  return del(['./server'], {force: true});
}

function commons(){
  return src(
    [
      './src/commons/**/*.js',
      '!./src/commons/**/__tests__',
      '!./src/commons/**/__tests__/**/*',
    ]
  )
    .pipe(babel({
      plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime'],
      presets: ['@babel/env', '@babel/react']
    }))
    .pipe(jsObfuscator({
      compact: true,
      sourceMap: false
    }))
    .pipe(dest('./server/commons'));
}

function server() {
  return src(
    [
      './src/srv/**/*.js',
      '!./src/srv/**/__tests__',
      '!./src/srv/**/__tests__/**/*',
    ]
  )
    .pipe(babel({
      plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime'],
      presets: ['@babel/env', '@babel/react']
    }))
    .pipe(jsObfuscator({
      compact: true,
      sourceMap: false
    }))
    .pipe(dest('./server/srv'));
}

exports.build = series(clean, commons, server);
