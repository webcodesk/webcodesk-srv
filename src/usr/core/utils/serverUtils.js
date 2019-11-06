import axios from 'axios';

let socket = undefined;
let axiosInstance;

function getInstance() {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: '/',
    });
  }
  return axiosInstance;
}

export function listenToAppWindow(callback) {
  if (!socket) {
    const { protocol, hostname, port } = window.location;
    socket = window.io.connect(protocol + '//' + hostname + ':' + port);
    socket.on('invitation', message => console.log(message));
    socket.on('mainWindowMessage', (message) => {
      if (message && callback) {
        callback(message);
      }
    });
  }
}

export function sendAppWidowMessage(type, payload) {
  if (socket) {
    socket.emit('appWindowMessage', { type, payload });
  } else {
    throw Error('socket.io client is not initialized.');
  }
}

export function showConfirmationDialog(message, callback) {
  const response = window.confirm(message);
  if (callback) {
    callback(response);
  }
}

function get(url) {
  return getInstance()
    .get(url)
    .then(response => response.data);
}

function post(url, body) {
  return getInstance()
    .post(url, body)
    .then(response => response.data);
}

export function invokeServer(methodName, data) {
  return post('/invoke', {
    methodName,
    data
  });
}
