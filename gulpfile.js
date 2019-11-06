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
