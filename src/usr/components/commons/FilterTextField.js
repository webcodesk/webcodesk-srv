import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Close from '@material-ui/icons/Close';
import FilterList from '@material-ui/icons/FilterList';
import InputBase from '@material-ui/core/InputBase';

const FilterIconButton = withStyles(theme => ({
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

const FilterIcon = withStyles(theme => ({
  root: {
    fontSize: '16px',
  }
}))(FilterList);

const FilterInputAdornment = withStyles(theme => ({
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
    marginLeft: '6px'
  }
});

class FilterTextField extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    placeholder: PropTypes.string,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    text: '',
    placeholder: 'Filter',
    onCancel: () => {
      console.info('FilterTextField.onCancel is not set');
    },
    onSubmit: () => {
      console.info('FilterTextField.onSubmit is not set');
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
    const {classes, placeholder} = this.props;
    const {inputText} = this.state;
    return (
      <InputBase
        inputRef={me => this.input = me}
        className={classes.root}
        type="text"
        value={inputText}
        placeholder={placeholder}
        onChange={this.handleOnChange}
        onKeyDown={this.handleOnKeyDown}
        startAdornment={
          <FilterInputAdornment position="start">
            <FilterIconButton onClick={this.handleOnSubmit}>
              <FilterIcon color="default" />
            </FilterIconButton>
          </FilterInputAdornment>
        }
        endAdornment={inputText && inputText.length > 0 &&
            <FilterInputAdornment position="end">
              <FilterIconButton onClick={this.handleOnCancel}>
                <CloseIcon color="disabled" />
              </FilterIconButton>
            </FilterInputAdornment>
            }
      />
    );
  }
}

export default withStyles(styles)(FilterTextField);
