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

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MarkdownIt from 'markdown-it';
import mila from 'markdown-it-link-attributes';
import { markdownHighlight } from 'usr/components/commons/utils';

const styles = theme => ({
  description: {
    padding: '2em 2em 7em 2em',
    minWidth: '150px',
    fontSize: '14px',
  },
});

window.__openURLInExternalWindow = function (element) {
  if (element && element.href) {
    window.open(element.href, '__blank').focus();
  }
  return false;
};

class MarkdownView extends React.Component {
  static propTypes = {
    markdownContent: PropTypes.string,
  };

  static defaultProps = {
    markdownContent: '### Empty content',
  };

  constructor (props) {
    super(props);
    this.markdown = new MarkdownIt({
      html: true,
      typographer: true,
      linkify: true,
      highlight: markdownHighlight,
    });
    this.markdown.use(mila, {
      attrs: {
        target: '_blank',
        rel: 'noopener',
        onclick: 'return __openURLInExternalWindow(this)'
      }
    });
  }

  render () {
    const { markdownContent, classes } = this.props;
    if (markdownContent) {
      return (
        <div
          className={`${classes.description} markdown-body`}
          dangerouslySetInnerHTML={{
            __html: this.markdown.render(markdownContent)
          }}
        />
      );
    }
    return <span>Empty content</span>
  }
}

export default withStyles(styles)(MarkdownView);
