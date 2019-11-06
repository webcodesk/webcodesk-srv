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
