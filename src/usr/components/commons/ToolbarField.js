import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Close from '@material-ui/icons/Close';
import Search from '@material-ui/icons/Search';
import FilterList from '@material-ui/icons/FilterList';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import InputBase from '@material-ui/core/InputBase';

const icons = {
  Search,
  OpenInBrowser,
  FilterList
};

const ToolbarIconButton = withStyles(theme => ({
  root: {
    padding: '4px',
    fontWeight: 'normal',
  }
}))(IconButton);

const CloseIcon = withStyles(theme => ({
  root: {
    fontSize: '16px',
  }
}))(Close);

const ToolbarInputBase = withStyles(theme => ({
  root: {
    fontSize: '16px',
  },
  input: {
    width: '100%'
  }
}))(InputBase);

const ToolbarInputAdornment = withStyles(theme => ({
  positionStart: {
    marginRight: 0,
  },
  positionEnd: {
    marginLeft: 0,
  }
}))(InputAdornment);

const styles = theme => ({
  root: {
    height: '30px',
    fontSize: '0.8125rem',
    marginLeft: '6px',
    flexGrow: 2,
    minWidth: '150px',
  }
});

class ToolbarField extends React.Component {
  static propTypes = {
    iconType: PropTypes.string,
    text: PropTypes.string,
    disabled: PropTypes.bool,
    placeholderText: PropTypes.string,
    buttonTitle: PropTypes.string,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    onButtonClick: PropTypes.func,
  };

  static defaultProps = {
    iconType: 'Search',
    text: '',
    disabled: false,
    placeholderText: '',
    buttonTile: '',
    onCancel: () => {
      // console.info('ToolbarField.onCancel is not set');
    },
    onSubmit: () => {
      // console.info('ToolbarField.onSubmit is not set');
    },
    onButtonClick: () => {
      // console.info('ToolbarField.onButtonClick is not set');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      inputText: this.props.text,
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { text } = this.props;
    if (text !== prevProps.text) {
      this.setState({
        inputText: text,
      });
    }
  }

  handleOnChange = () => {
    this.setState({
      inputText: this.input.value,
    })
  };

  handleOnCancel = () => {
    this.setState({
      inputText: '',
    });
    this.input.focus();
    this.props.onCancel();
  };

  handleOnSubmit = () => {
    this.props.onSubmit(this.state.inputText);
  };

  handleOnKeyDown = (e) => {
    if (e) {
      if (e.which === 13) {
        // Enter
        this.handleOnSubmit();
      }
    }
  };

  handleOnButtonClick = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onButtonClick(this.state.inputText);
  };

  render () {
    const {classes, iconType, disabled, placeholderText, buttonTitle} = this.props;
    const {inputText} = this.state;
    return (
      <ToolbarInputBase
        inputRef={me => this.input = me}
        className={classes.root}
        type="text"
        value={inputText}
        placeholder={placeholderText}
        disabled={disabled}
        onChange={this.handleOnChange}
        onKeyDown={this.handleOnKeyDown}
        startAdornment={
          <ToolbarInputAdornment position="start">
            <ToolbarIconButton
              onClick={this.handleOnButtonClick}
              title={buttonTitle}
              disabled={disabled}
            >
              {React.createElement(icons[iconType], {fontSize: 'small', color: 'primary'})}
            </ToolbarIconButton>
          </ToolbarInputAdornment>
        }
        endAdornment={inputText && inputText.length > 0 &&
            <ToolbarInputAdornment position="end">
              <ToolbarIconButton onClick={this.handleOnCancel}>
                <CloseIcon color="disabled" />
              </ToolbarIconButton>
            </ToolbarInputAdornment>
            }
      />
    );
  }
}

export default withStyles(styles)(ToolbarField);
