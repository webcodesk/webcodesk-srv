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
import { getOffset } from '../../core/utils/windowUtils';

const containerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  overflowX: 'auto',
  backgroundColor: '#eceff1',
};

const defaultInnerContainerStyle = {
  position: 'absolute',
  top: '16px',
  left: '16px',
  bottom: '16px',
  right: '16px',
};

const webViewStyle = {
  position: 'relative',
  height: '100%',
  width: '100%',
  backgroundColor: '#ffffff',
  border: 0,
  zIndex: 0,
};

class IFrame extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    onIFrameMessage: PropTypes.func,
    width: PropTypes.string,
    scale: PropTypes.number,
    onIFrameReady: PropTypes.func,
  };

  static defaultProps = {
    width: '100%',
    scale: 1,
    onIFrameMessage: (message) => {
      console.info('IFrame received the message: ', message);
    },
    onIFrameReady: () => {
      console.info('IFrame.onIFrameReady is not set');
    },
  };

  constructor (props) {
    super(props);
    this.frameWindow = React.createRef();
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount () {
    window.addEventListener("message", this.handleIFrameMessage, false);
    if (this.frameWindow.current) {
      this.frameWindow.current.addEventListener('load', this.handleDidFinishLoad);
    }
  }

  componentWillUnmount () {
    window.removeEventListener("message", this.handleIFrameMessage);
    if (this.frameWindow.current) {
      this.frameWindow.current.removeEventListener('load', this.handleDidFinishLoad);
    }
  }

  shouldComponentUpdate (nextProps, nextState, nextContent) {
    const { url, width, scale } = this.props;
    const { url: nextUrl, width: nextWidth, scale: nextScale } = nextProps;
    return url !== nextUrl || width !== nextWidth || scale !== nextScale;
  }

  handleDidFinishLoad = () => {
    if (this.frameWindow.current) {
      const url = this.frameWindow.current.src;
      this.props.onIFrameReady(url);
    }
  };

  handleDidFailLoad = () => {
    // do nothing?
  };

  sendMessage (message) {
    if (this.frameWindow.current) {
      this.frameWindow.current.contentWindow.postMessage(message, '*');
    }
  }

  handleIFrameMessage = (e) => {
    const { data } = e;
    const { onIFrameMessage } = this.props;
    onIFrameMessage(data);
  };

  reloadPage = () => {
    if (this.frameWindow.current) {
      const url = this.frameWindow.current.src;
      // this.frameWindow.current.src = '';
      setTimeout(() => {
        this.frameWindow.current.src = url;
      }, 1);
    }
  };

  loadURL = (url) => {
    if (this.frameWindow.current) {
      this.frameWindow.current.src = url;
    }
  };

  setFocus = () => {
    if (this.frameWindow.current) {
      this.frameWindow.current.contentWindow.focus();
    }
  };

  getOffset = () => {
    if (this.frameWindow.current) {
      return getOffset(this.frameWindow.current);
    }
  };

  render () {
    const { url, width, scale } = this.props;
    let innerContainerStyle;
    if (width === "100%") {
      innerContainerStyle = defaultInnerContainerStyle;
    } else {
      innerContainerStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width,
        padding: '16px',
        backgroundColor: containerStyle.backgroundColor,
      };
    }
    let iFrameStyle = webViewStyle;
    if (scale < 1) {
      iFrameStyle = {
        ...iFrameStyle,
        height: `calc(100% + ${(100 * (1 - scale))}%)`,
        transform: `scale(${scale})`,
        transformOrigin: '0 0'
      };
    }
    return (
      <div style={containerStyle}>
        <div style={innerContainerStyle}>
          <iframe
            ref={this.frameWindow}
            style={iFrameStyle}
            src={url}
          >
          </iframe>
        </div>
      </div>
    );
  }
}

export default IFrame;
