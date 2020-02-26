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

const child_process = require('child_process');
const psTree = require('ps-tree');
const nodeProcess = require('process');
const { StringDecoder } = require('string_decoder');
const fixPath = require('fix-path');
const appWindowMessages = require('../commons/appWindowMessages');

let processChild;

let logRecords = [];
let serverStatus = {};

const decoder = new StringDecoder('utf8');

let sendMessageHook;

function setSendMessageHook (sendMessageCallback) {
  sendMessageHook = sendMessageCallback;
}

function sendServerStatus (newStatus) {
  serverStatus = { ...serverStatus, ...newStatus };
  if (sendMessageHook) {
    sendMessageHook(appWindowMessages.PROJECT_SERVER_STATUS_RESPONSE, serverStatus);
  }
}

let startingServerTimeoutId;

function getCurrentTimeString() {
  const time = new Date();
  let minutes = time.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  let hours = time.getHours();
  hours = hours < 10 ? `0${hours}` : hours;
  let seconds = time.getSeconds();
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  let milliseconds = time.getMilliseconds();
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function startServer ({ projectDirPath, startScriptPath, port }) {
  logRecords = [];

  if (!startingServerTimeoutId) {
    sendServerStatus({
      isWorking: false,
      isStarting: true,
      isLogErrors: false,
    });

    startingServerTimeoutId = setTimeout(() => {
      processChild = child_process.spawn('node',
        [startScriptPath],
        {
          env: {
            ...process.env,
            PORT: port,
            BROWSER: 'none'
          },
          cwd: projectDirPath
        },
      );

      startingServerTimeoutId = undefined;

      if (processChild) {
        processChild.on('error', function (err) {
          logRecords.unshift('Server throws the error: ' + err + '\n\n');
          logRecords.unshift('\n\n' + getCurrentTimeString() + '\n');
          sendServerStatus({
            isWorking: false,
            isStarting: false,
            isLogErrors: false,
          });
        });

        if (processChild.stdout) {
          processChild.stdout.on('data', function (data) {
            logRecords.unshift(decoder.write(Buffer.from(data)));
            logRecords.unshift('\n\n' + getCurrentTimeString() + '\n');
            sendServerStatus({
              isWorking: true,
              isStarting: false,
              isLogErrors: false,
            });
          });
        }

        if (processChild.stderr) {
          processChild.stderr.on('data', function (data) {
            logRecords.unshift(decoder.write(Buffer.from(data)));
            logRecords.unshift('\n\n' + getCurrentTimeString() + '\n');
            sendServerStatus({
              isWorking: true,
              isStarting: false,
              isLogErrors: true,
            });
          });
        }

        processChild.on('exit', function (code, signal) {
          logRecords.unshift('Server process exited with ' +
            `code ${code} and signal ${signal}\n\n`);
          logRecords.unshift('\n\n' + getCurrentTimeString() + '\n');
          processChild = null;
          sendServerStatus({
            isWorking: false,
          });
        });
      }
    }, 3000);
  }
}

function stopServer (callback) {
  callback = callback || function () {};
  if (!startingServerTimeoutId && processChild && checkProcess(processChild.pid)) {
    kill(processChild.pid, () => {
      processChild = null;
      sendServerStatus({
        isWorking: false,
      });
      callback();
    });
  } else {
    sendServerStatus({
      isWorking: false,
    });
    callback();
  }
}

function getServerStatus () {
  return serverStatus;
}

function getServerLog () {
  return {
    logRecords: logRecords
  };
}

function checkProcess (pid) {
  if (!pid) {
    return false;
  }
  try {
    nodeProcess.kill(pid, 0);
    return true;
  } catch (err) {
    // there is no such a process...
    return false;
  }
}

function kill (pid, callback) {
  const signal = 'SIGKILL';
  if (process.platform !== 'win32') {
    psTree(pid, function (err, children) {
      [pid].concat(
        children.map(function (p) {
          return p.PID;
        })
      ).forEach(function (tpid) {
        try {
          nodeProcess.kill(tpid, signal);
        } catch (ex) { }
      });
      callback();
    });
  } else {
    try {
      nodeProcess.kill(pid, signal);
    } catch (ex) { }
    callback();
  }
}

fixPath();

module.exports = {
  startServer,
  stopServer,
  getServerLog,
  getServerStatus,
  setSendMessageHook,
};