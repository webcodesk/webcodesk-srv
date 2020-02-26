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
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        throw Error(error.response.data);
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        throw Error(`The response is not received: ${error.request}`);
        // console.log(error.request);
      } else {
        // Something happened in setting up the request and triggered an Error
        throw Error(error.message);
        // console.log('Error', error.message);
      }
      // console.log(error);
    });
}

export function invokeServer(methodName, data) {
  return post('/invoke', { methodName, data });
}
