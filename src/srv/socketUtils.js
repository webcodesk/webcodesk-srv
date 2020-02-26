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
