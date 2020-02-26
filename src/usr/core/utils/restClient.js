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
    .catch(err => {
      console.error(`Error downloading from URL ${url} into ${destDirPath}. `, err);
    });
}
