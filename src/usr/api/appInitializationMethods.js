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

import { listenToAppWindow } from '../core/utils/serverUtils';

export const initApplication = () => (dispatch) => {
  listenToAppWindow((message) => {
    if (message) {
      const { type: messageType, payload: messageData } = message;
      dispatch({mainWindowMessage: { messageType, messageData }});
    }
  });
};

export const showErrorNotification = (error) => (dispatch) => {
  const message = error && error.message;
  if (message && message.length > 0) {
    dispatch({notification: {message, options: {variant: 'error', autoHideDuration: 5000}}})
  }
};

export const showMultipleErrorsNotification = (errors) => (dispatch) => {
  if (errors && errors.length > 0) {
    errors.forEach(error => {
      const message = error && error.message;
      if (message && message.length > 0) {
        dispatch({notification: {message, options: {variant: 'error', autoHideDuration: 5000}}})
      }
    });
  }
};

export const showSuccessNotification = (message) => (dispatch) => {
  if (message && message.length > 0) {
    dispatch({notification: {message, options: {variant: 'success', autoHideDuration: 4000}}})
  }
};

export const showInformationNotification = (message) => (dispatch) => {
  if (message && message.length > 0) {
    dispatch({notification: {message, options: {variant: 'info', autoHideDuration: 4000}}})
  }
};
