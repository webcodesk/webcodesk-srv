import React from 'react';
import PropTypes from 'prop-types';
import constants from '../../../commons/constants';
import { getOffset } from '../../core/utils/windowUtils';

const containerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  overflowX: 'auto',
  backgroundColor: '#f5f5f5',
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
};

class IFrame extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    onIFrameMessage: PropTypes.func,
    width: PropTypes.string,
    top: PropTypes.string,
    left: PropTypes.string,
    padding: PropTypes.string,
    onIFrameReady: PropTypes.func,
    onDevToolClosedManually: PropTypes.func,
  };

  static defaultProps = {
    width: constants.MEDIA_QUERY_WIDTH_AUTO_NAME,
    onIFrameMessage: (message) => {
      console.info('IFrame received the message: ', message);
    },
    onIFrameReady: () => {
      console.info('IFrame.onIFrameReady is not set');
    },
    onDevToolClosedManually: () => {
      console.info('IFrame.onDevToolClosedManually is not set');
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
    const { url, width } = this.props;
    const { url: nextUrl, width: nextWidth } = nextProps;
    return url !== nextUrl || width !== nextWidth;
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

  handleDevtoolClosed = () => {
    this.props.onDevToolClosedManually();
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
      }, 500);
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
    const { url, width } = this.props;
    let innerContainerStyle;
    if (width === constants.MEDIA_QUERY_WIDTH_AUTO_NAME) {
      innerContainerStyle = defaultInnerContainerStyle;
    } else {
      innerContainerStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: constants.LIVE_PREVIEWS[width].width,
        padding: '16px',
        backgroundColor: containerStyle.backgroundColor,
      };
    }
    return (
      <div style={containerStyle}>
        <div style={innerContainerStyle}>
          <iframe
            ref={this.frameWindow}
            style={webViewStyle}
            src={url}
          >
          </iframe>
        </div>
      </div>
    );
  }
}

export default IFrame;
