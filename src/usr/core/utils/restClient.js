import { invokeServer } from './serverUtils';
import axios from 'axios';
import * as constants from '../../../commons/constants';

let axiosInstance;

function getInstance() {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: constants.URL_GITHUB_API,
      // headers: {
      //   'User-Agent': 'axios'
      // }
    });
  }
  return axiosInstance;
}

export function get(url, token) {
  return getInstance()
    .get(url, {
      headers: {
        'X-Auth-Token': token ? token : ''
      }
    })
    .then(response => response.data);
}

export function getRaw(url) {
  return getInstance()
    .get(url, {
      headers: {
        Accept: 'application/vnd.github.v3.raw',
      }
    })
    .then(response => response.data);
}

export function getHTML(url) {
  return getInstance()
    .get(url, {
      headers: {
        Accept: 'application/vnd.github.v3.html',
      }
    })
    .then(response => response.data);
}

export function post(url, token, body) {
  return getInstance()
    .post(url, body, {headers: {'X-Auth-Token': token ? token : ''}})
    .then(response => response.data);
}

export function download2(url, destDirPath) {
  return invokeServer('download', {url, destDirPath});
}
