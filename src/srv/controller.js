import express from 'express';
import http from 'http';
import path from 'path';
import io from 'socket.io';
import bodyParser from 'body-parser';

import * as config from './config';
import * as socketUtils from './socketUtils';
import * as api from './api';
import projectServer from './projectServer';
import watcher from './watcher';

function callMethod (req, res) {
  let methodName = req.body.methodName;
  let data = req.body.data;
  if (api[methodName]) {
    try {
      const result = api[methodName](data);
      if (result && result.then) {
        result
          .then(response => {
            res.send(response);
          })
          .catch(err => {
            let errorMessage = err.message ? err.message : err;
            res.status(500).send(errorMessage);
          });
      } else {
        res.send(result);
      }
    } catch (err) {
      let errorMessage = err.message ? err.message : err;
      res.status(500).send(errorMessage);
    }
  } else {
    res.status(500).send('The Webcodesk server does not have method: ' + methodName);
  }
}

function returnError(err, req, res) {
  console.error(err.stack);
  res.status(500).send(err.stack);
}

export function initServer (options) {
  const {serverDir, projectDir, portNumber, host} = options;
  const hostname = host || 'localhost';

  config.setServerDirPath(serverDir);
  config.setProjectDirPath(projectDir);

  const app = express();
  app.use(express.static(path.join(serverDir, 'build')));

  app.use((err, req, res, next) => {
    returnError(err, req, res);
  });

  app.post('/invoke', bodyParser.json({limit: '50mb'}), (req, res) => {
    callMethod(req, res);
  });
  // All remaining requests return the React app, so it can handle routing.
  app.get('/', (req, res) => {
    res.sendFile(path.join(serverDir, 'build', 'index.html'))
  });

  const appServer = http.createServer(app);

  const ioSocket = io(appServer);
  ioSocket.on('connection', socket => {
    socketUtils.setIoSocketClient(socket);
  });

  api.restartProjectServer();

  appServer.listen(portNumber, hostname, () => {
    console.log(`The Webcodesk server has been started successfully on port: ${portNumber}`);
    console.log(`Open in the browser: http://${hostname}:${portNumber}`);
  });
}

export function destroyServer() {
  console.log('');
  console.log('The Webcodesk server is gracefully shutdown.');
  watcher.stopWatchingFiles();
  projectServer.stopServer();
}
