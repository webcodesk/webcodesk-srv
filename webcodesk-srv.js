#!/usr/bin/env node

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

var path = require('path');
var minimist = require('minimist');
var controller = require('./server/srv/controller.js');

function noop() {
}

function cleanUp(callback) {
  // attach user callback to the process event emitter
  // if no callback, it will still exit gracefully on Ctrl-C
  callback = callback || noop;

  // do app specific cleaning before exiting
  process.on('exit', function () {
    callback();
  });

  // catch ctrl+c event and exit normally
  process.on('SIGINT', function () {
    process.exit(2);
  });

  process.on('SIGTERM', function () {
    process.exit(2);
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function(err) {
    if(err.code === 'EADDRINUSE'){
      console.error('Port is already in use. Please set up another port using option: -p <YOUR_PORT>.');
    } else {
      console.log(err.stack);
    }
    process.exit(99);
  });
}

cleanUp(controller.destroyServer);

var argv = minimist(process.argv.slice(2));

var portNumber = 7070;
if(argv['p']){
  var tryPort = parseInt(argv['p']);
  if(tryPort && tryPort > 1024 && tryPort < 65000){
    portNumber = tryPort;
  } else {
    console.error(
      'Specified port is not withing 1024-65000 range. Please set another port number using option: -p <YOUR_PORT>.'
    );
    console.log(
      'Now using port number ' + portNumber
    );
  }
}

var host = argv['h'] || 'localhost';

var workingDir = process.cwd();
if(argv['d']){
  if(path.isAbsolute(argv['d'])){
    workingDir = argv['d'];
  } else {
    workingDir = path.resolve(workingDir, argv['d']);
  }
}

// Prevents the program from closing instantly
process.stdin.resume();

controller.initServer({ serverDir: __dirname, projectDir: workingDir, portNumber: portNumber, host: host });
