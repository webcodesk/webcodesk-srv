import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  actions: {
    display: 'flex',
    justifyContent: 'center',
  },
  text: {
    marginBottom: '16px'
  }
});

class WelcomeDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    onClose: () => {
      console.info('WelcomeDialog.onClose is not set');
    },
    onSubmit: () => {
      console.info('WelcomeDialog.onSubmit is not set');
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      doNotShowAgain: true,
    };
  }

  handleClose = () => {
    this.props.onClose(this.state.doNotShowAgain);
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.doNotShowAgain);
  };

  handleChangeDoNotShowAgain = (e) => {
    this.setState({
      doNotShowAgain: !e.target.checked,
    });
  };

  render () {
    const { doNotShowAgain } = this.state;
    const { classes, isOpen } = this.props;
    if (!isOpen) {
      return null;
    }
    return (
      <Dialog
        aria-labelledby="DeletePageDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle id="DeletePageDialog-dialog-title">Welcome!</DialogTitle>
        <DialogContent>
          <Typography variant="body1" className={classes.text}>
            We have a great beginner tutorial, doing which you will learn how to create Web Applications in Webcodesk.
          </Typography>
          <Typography variant="body1">
            Would you like to do the tutorial?
          </Typography>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button type="submit" onClick={this.handleSubmit} color="primary">
            Sure, that would be great
          </Button>
          <Button onClick={this.handleClose}>
            No, thanks
          </Button>
          <FormControlLabel
            control={
              <Checkbox
                color="default"
                checked={!doNotShowAgain}
                onChange={this.handleChangeDoNotShowAgain}
              />
            }
            labelPlacement="start"
            label="Remind me next time"
          />
        </DialogActions>
        <DialogActions>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(WelcomeDialog);
