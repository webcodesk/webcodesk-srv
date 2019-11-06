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

import 'highlight.js/styles/github.css';
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import * as constants from '../../../commons/constants';

hljs.registerLanguage('javascript', javascript);

export function highlightBlock(codeBlockElement) {
  hljs.highlightBlock(codeBlockElement);
}

export function markdownHighlight(str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, str, true).value;
    } catch (__) {}
  }

  return ''; // use external default escaping
}

export function offset(el) {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    right: rect.right + scrollLeft,
    bottom: rect.bottom + scrollTop }
}

export function getComponentName(canonicalComponentName) {
  const titleParts = canonicalComponentName ? canonicalComponentName.split('.') : [];
  if (titleParts.length > 0) {
    return titleParts[titleParts.length - 1];
  }
  return canonicalComponentName;
}

export function cutText(text, limit = 25) {
  if (text && text.length >= limit) {
    return text.substr(0, limit - 3) + '...';
  }
  return text;
}

export function cutFilePath(filePath, limit = 60, trimTo = 5) {
  let result = filePath;
  if (result && result.length > limit && trimTo > 1) {
    const parts = result.split(constants.FILE_SEPARATOR);
    if (parts && parts.length > trimTo) {
      result = `.../${parts.slice(parts.length - trimTo, parts.length).join(constants.FILE_SEPARATOR)}`;
      if (result.length > limit) {
        return cutFilePath(result, limit, trimTo - 1);
      }
    }
  }
  return result;
}
