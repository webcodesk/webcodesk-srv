import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Chip from '@material-ui/core/Chip';

export const CommonToolbar = withStyles(theme => ({
  root: {
    minHeight: '38px',
    height: '38px',
    borderBottom: '1px solid #dddddd',
    flexWrap: 'nowrap',
  }
}))(Toolbar);

export const CommonToolbarButton = withStyles(theme => ({
  sizeSmall: {
    padding: '2px 8px',
    borderRadius: '16px',
    textTransform: 'none',
    fontWeight: 'normal',
    minHeight: '24px',
    marginLeft: '6px',
    whiteSpace: 'nowrap'
  }
}))(Button);

export const CommonToolbarDivider = withStyles(theme => ({
  root: {
    height: '20px',
    width: '1px',
    marginLeft: '6px',
  }
}))(Divider);

export const CommonToolbarIconButton = withStyles(theme => ({
  sizeSmall: {
    padding: '4px',
    fontWeight: 'normal',
    marginLeft: '6px',
    minWidth: 0,
    minHeight: 0,
    borderRadius: '50%',
  }
}))(Button);

export const CommonDialog = withStyles(theme => ({
  paper: {
    width: '500px',
  }
}))(Dialog);

export const WarningText = withStyles(theme => ({
  root: {
    color: '#ff9800',
    display: 'flex',
    alignItems: 'flex-start'
  }
}))(Typography);

export const CommonTabs = withStyles(theme => ({
  root: {
    minHeight: 'auto',
    minWidth: '190px',
    backgroundColor: '#f5f5f5',
  }
}))(Tabs);

export const CommonTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    minHeight: 'auto',
    minWidth: 'auto',
    paddingLeft: '5px',
    paddingRight: '5px',
    fontSize: '0.8125rem',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  wrapper: {
    flexDirection: 'row',
  },
  labelIcon: {
    paddingTop: 0,
  },
  labelContainer: {
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  selected: {
    backgroundColor: theme.palette.background.paper,
  }
}))(Tab);

export const CommonTabError = withStyles(theme => ({
  root: {
    textTransform: 'none',
    minHeight: 'auto',
    minWidth: 'auto',
    paddingLeft: '5px',
    paddingRight: '5px'
  },
  wrapper: {
    flexDirection: 'row',
  },
  labelIcon: {
    paddingTop: 0,
  },
  labelContainer: {
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  label: {
    color: '#D50000',
  },
  selected: {
    backgroundColor: theme.palette.background.paper,
  }
}))(Tab);

export const CommonErrorBadge = withStyles(theme => ({
  colorSecondary: {
    width: '10px',
    height: '10px',
    top: '-3px',
    right: '-10px',
  }
}))(Badge);

export const FullScreenDialog = withStyles(theme => ({
  paper: {
    overflow: 'hidden'
  }
}))(Dialog);

export const CommonChipButton = withStyles(theme => ({
  root: {
    marginLeft: '6px'
  }
}))(Chip);