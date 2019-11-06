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

import * as appWindowMessages from '../commons/appWindowMessages';
import projectServer from './projectServer';

let ioSocketClient = undefined;

let messageQueue = [];

export function setIoSocketClient(value) {
  if (value) {
    ioSocketClient = value;
    ioSocketClient.emit('invitation', 'Hello from the Webcodesk server.');
    if (messageQueue.length > 0) {
      messageQueue.forEach(messageItem => {
        sendMainWindowMessage(messageItem.type, messageItem.payload);
      });
      messageQueue = [];
    }
    ioSocketClient.on('appWindowMessage', (message) => {
      const {type} = message;
      if (type === appWindowMessages.PROJECT_SERVER_STATUS_REQUEST) {
        sendMainWindowMessage(appWindowMessages.PROJECT_SERVER_STATUS_RESPONSE, projectServer.getServerStatus());
      } else if (type === appWindowMessages.PROJECT_SERVER_LOG_REQUEST) {
        sendMainWindowMessage(appWindowMessages.PROJECT_SERVER_LOG_RESPONSE, projectServer.getServerLog());
      }
    });
  }
}

export function sendMainWindowMessage(type, payload = {}) {
  if (ioSocketClient) {
    ioSocketClient.emit(
      'mainWindowMessage',
      { type, payload }
    );
  } else {
    messageQueue.push({ type, payload });
    // console.error('socket.io is not initialized on the server-side');
  }
}
