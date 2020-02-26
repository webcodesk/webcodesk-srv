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
