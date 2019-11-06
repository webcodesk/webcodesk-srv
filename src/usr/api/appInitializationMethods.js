import { listenToAppWindow } from '../core/utils/serverUtils';

export const initApplication = () => (dispatch) => {
  listenToAppWindow((message) => {
    if (message) {
      const { type: messageType, payload: messageData } = message;
      dispatch('mainWindowMessage', { messageType, messageData });
    }
  });
};

export const showErrorNotification = (error) => (dispatch) => {
  const message = error && error.message;
  if (message && message.length > 0) {
    dispatch('notification', {message, options: {variant: 'error', autoHideDuration: 5000}})
  }
};

export const showMultipleErrorsNotification = (errors) => (dispatch) => {
  if (errors && errors.length > 0) {
    errors.forEach(error => {
      const message = error && error.message;
      if (message && message.length > 0) {
        dispatch('notification', {message, options: {variant: 'error', autoHideDuration: 5000}})
      }
    });
  }
};

export const showSuccessNotification = (message) => (dispatch) => {
  if (message && message.length > 0) {
    dispatch('notification', {message, options: {variant: 'success', autoHideDuration: 4000}})
  }
};

export const showInformationNotification = (message) => (dispatch) => {
  if (message && message.length > 0) {
    dispatch('notification', {message, options: {variant: 'info', autoHideDuration: 4000}})
  }
};
