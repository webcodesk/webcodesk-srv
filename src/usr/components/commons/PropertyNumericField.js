import debounce from 'lodash/debounce';
import isNull from 'lodash/isNull';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Close from '@material-ui/icons/Close';
import InputBase from '@material-ui/core/InputBase';

const PropertyNumericInput = withStyles(theme => ({
  root: {
    width: '100%'
  },
  input: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    fontSize: '0.8125rem',
    borderRadius: '4px',
    padding: '3px',
  },
}))(InputBase);

const PropertyNumericIconButton = withStyles(theme => ({
  root: {
    padding: '4px',
    fontWeight: 'normal',
  }
}))(IconButton);

const CloseIcon = withStyles(theme => ({
  root: {
    fontSize: '12px',
    padding: '3px'
  }
}))(Close);

const PropertyNumericInputAdornment = withStyles(theme => ({
  positionStart: {
    marginRight: 0,
  },
  positionEnd: {
    marginLeft: 0,
  }
}))(InputAdornment);

const styles = theme => ({
  root: {
    width: '100%',
    fontSize: '0.8125rem',
  }
});

class PropertyTextField extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    value: null,
    onChange: () => {
      console.info('PropertyTextField.onChange is not set');
    },
    onSubmit: () => {
      console.info('PropertyTextField.onSubmit is not set');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      inputValue: this.props.value,
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { inputValue } = this.state;
    return inputValue !== nextProps.value || inputValue !== nextState.inputValue;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { value } = this.props;
    if (value !== prevProps.value) {
      this.setState({
        inputValue: value,
      });
    }
  }

  debounceOnChange = debounce((newInputValue) => {
    this.props.onChange(newInputValue);
  }, 500);

  handleOnChange = () => {
    this.setState({
      inputValue: this.input.value,
    });
    this.debounceOnChange(this.input.value);
  };

  handleOnCancel = () => {
    this.setState({
      inputValue: null,
    });
    this.input.focus();
    this.props.onChange();
  };

  handleOnSubmit = () => {
    this.props.onSubmit(this.state.inputValue);
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
    const {inputValue} = this.state;
    return (
      <PropertyNumericInput
        inputRef={me => this.input = me}
        type="number"
        value={isNull(inputValue) ? '' : inputValue}
        placeholder="Enter number"
        onChange={this.handleOnChange}
        onKeyDown={this.handleOnKeyDown}
        endAdornment={
          <PropertyNumericInputAdornment position="end">
            <PropertyNumericIconButton onClick={this.handleOnCancel}>
              <CloseIcon color="disabled"/>
            </PropertyNumericIconButton>
          </PropertyNumericInputAdornment>
        }
      />
    );
  }
}

export default withStyles(styles)(PropertyTextField);
