import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Close from '@material-ui/icons/Close';
import Search from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const SearchIconButton = withStyles(theme => ({
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

const SearchIcon = withStyles(theme => ({
  root: {
    fontSize: '16px',
  }
}))(Search);

const SearchInputAdornment = withStyles(theme => ({
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
    width: '100%',
    fontSize: '0.8125rem',
  }
});

class SearchTextField extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    text: '',
    onCancel: () => {
      console.info('SearchTextField.onCancel is not set');
    },
    onSubmit: () => {
      console.info('SearchTextField.onSubmit is not set');
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
      } else if (e.which === 27) {
        // Cancel
        this.handleOnCancel();
      }
    }
  };

  render () {
    const {classes} = this.props;
    const {inputText} = this.state;
    return (
      <InputBase
        inputRef={me => this.input = me}
        className={classes.root}
        type="text"
        value={inputText}
        placeholder="Search"
        onChange={this.handleOnChange}
        onKeyDown={this.handleOnKeyDown}
        startAdornment={
          <SearchInputAdornment position="start">
            <SearchIconButton onClick={this.handleOnSubmit}>
              <SearchIcon color="primary" />
            </SearchIconButton>
          </SearchInputAdornment>
        }
        endAdornment={inputText && inputText.length > 0 &&
            <SearchInputAdornment position="end">
              <SearchIconButton onClick={this.handleOnCancel}>
                <CloseIcon color="disabled" />
              </SearchIconButton>
            </SearchInputAdornment>
            }
      />
    );
  }
}

export default withStyles(styles)(SearchTextField);
