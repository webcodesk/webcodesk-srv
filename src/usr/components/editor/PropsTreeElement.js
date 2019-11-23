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
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropertyTextField from '../commons/PropertyTextField';

const styles = theme => ({
  mutedText: {
    color: theme.palette.text.disabled,
  },
  titleText: {
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  subtitleText: {
    color: theme.palette.text.disabled,
    whiteSpace: 'nowrap',
    marginBottom: '5px',
  },
  errorText: {
    color: '#D50000',
    whiteSpace: 'nowrap',
    fontSize: '10px'
  },
  editorWrapper: {
    width: '100%',
    border: '1px solid #dcdcdc',
    borderRadius: '4px',
    marginTop: '5px',
    marginBottom: '5px',
  },
  propertyEditorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    overflow: 'hidden',
    paddingRight: '2px'
  }
});

const PropsTreeListElement = withStyles(theme => ({
  root: {
    alignItems: 'flex-start',
    position: 'relative',
    cursor: 'default',
    // '&:hover': {
    //   backgroundColor: theme.palette.action.hover,
    // },
    userSelect: 'none',
  },
  dense: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    margin: '5px 0',
  }
}))(ListItem);

const PropsTreeListElementText = withStyles({
  root: {
    padding: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
})(ListItemText);

export const PropsTreeElementButton = withStyles(theme => ({
  sizeSmall: {
    padding: '2px 8px',
    borderRadius: '16px',
    textTransform: 'none',
    fontWeight: 'normal',
    minHeight: '24px',
    whiteSpace: 'nowrap',
    backgroundColor: '#f5f5f5'
  }
}))(Button);

class PropsTreeElement extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    subname: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    title: PropTypes.string,
    paddingLeft: PropTypes.string,
    disabled: PropTypes.bool,
    color: PropTypes.oneOf(['default', 'primary', 'secondary']),
    onChange: PropTypes.func,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    name: null,
    subname: null,
    type: 'input',
    value: null,
    title: null,
    paddingLeft: '0px',
    disabled: false,
    color: 'default',
    onChange: () => {
      console.info('PropsTreeElement.onChange is not set');
    },
    onClick: () => {
      console.info('PropsTreeElement.onClick is not set');
    },
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      error: '',
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { value } = this.props;
    if (value && value !== prevProps.value && value.length > 0) {
      this.setState({
        error: '',
      });
    }
  }

  handleChange = (value) => {
    if (value && value.length > 0) {
      this.props.onChange(value);
      this.setState({
        error: ''
      });
    } else {
      this.setState({
        error: 'Can not be empty'
      });
    }
  };

  handleClick = () => {
    this.props.onClick();
  };

  render () {
    const {
      classes,
      paddingLeft,
      name,
      subname,
      type,
      value,
      disabled,
      color
    } = this.props;
    const { error } = this.state;
    let editorElement;
    switch (type) {
      case 'button':
        editorElement = (
          <PropsTreeListElement
            style={{ paddingLeft }}
            button={false}
          >
            <PropsTreeListElementText
              title={name}
              disableTypography={true}
              primary={
                <PropsTreeElementButton
                  color={color}
                  size="small"
                  fullWidth={true}
                  disabled={disabled}
                  onClick={this.handleClick}
                >
                  {name}
                </PropsTreeElementButton>
              }
              secondary={subname && (
                <div className={classes.subtitleText}>
                  <span>{subname}</span>
                </div>
              )}
            />
          </PropsTreeListElement>
        );
        break;
      case 'input':
      default:
        editorElement = (
          <PropsTreeListElement
            style={{ paddingLeft }}
            button={false}
          >
            <div className={classes.propertyEditorContainer}>
              {name && (
                <div>
                  <PropsTreeListElementText
                    title={name}
                    primary={
                      <span style={{ whiteSpace: 'nowrap' }}>
                        <span className={classes.titleText}>{name}</span>
                      </span>
                    }
                  />
                </div>
              )}
              <div className={classes.editorWrapper}>
                <div style={{marginLeft: '5px'}}>
                  <PropertyTextField
                    text={value}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              {error && (
                <Typography variant="caption" className={classes.subtitleText}>
                  <span className={classes.errorText}>{error}</span>
                </Typography>
              )}
              {subname && (
                <Typography variant="caption" className={classes.subtitleText}>
                  <span>{subname}</span>
                </Typography>
              )}
            </div>
          </PropsTreeListElement>
        );
        break;
    }
    return editorElement;
  }
}

export default withStyles(styles)(PropsTreeElement);
