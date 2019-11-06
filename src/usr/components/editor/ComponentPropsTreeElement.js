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
    marginBottom: '5px'
  },
  propertyEditorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%'
  }
});

const ComponentPropsTreeListElement = withStyles(theme => ({
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

const ComponentPropsTreeListElementText = withStyles({
  root: {
    padding: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
})(ListItemText);

export const ComponentPropsTreeElementButton = withStyles(theme => ({
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

class ComponentPropsTreeElement extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    subname: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    title: PropTypes.string,
    paddingLeft: PropTypes.string,
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
    onChange: () => {
      console.info('ComponentPropsTreeElement.onChange is not set');
    },
    onClick: () => {
      console.info('ComponentPropsTreeElement.onClick is not set');
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
    } = this.props;
    const { error } = this.state;
    let editorElement;
    switch (type) {
      case 'button':
        editorElement = (
          <ComponentPropsTreeListElement
            style={{ paddingLeft }}
            button={false}
          >
            <ComponentPropsTreeListElementText
              title={name}
              disableTypography={true}
              primary={
                <ComponentPropsTreeElementButton
                  color="default"
                  size="small"
                  fullWidth={true}
                  onClick={this.handleClick}
                >
                  {name}
                </ComponentPropsTreeElementButton>
              }
              secondary={subname && (
                <div className={classes.subtitleText}>
                  <span>{subname}</span>
                </div>
              )}
            />
          </ComponentPropsTreeListElement>
        );
        break;
      case 'input':
      default:
        editorElement = (
          <ComponentPropsTreeListElement
            style={{ paddingLeft }}
            button={false}
          >
            <div className={classes.propertyEditorContainer}>
              {name && (
                <div>
                  <ComponentPropsTreeListElementText
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
          </ComponentPropsTreeListElement>
        );
        break;
    }
    return editorElement;
  }
}

export default withStyles(styles)(ComponentPropsTreeElement);
