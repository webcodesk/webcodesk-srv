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
  return invokeServer('download', {url, destDirPath})
    .then(err => {
      console.error(`Error downloading from URL ${url} into ${destDirPath}. `, err);
    });
}
