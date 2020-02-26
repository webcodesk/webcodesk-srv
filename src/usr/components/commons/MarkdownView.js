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
