import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';

export const ResourceTabs = withStyles(theme => ({
  root: {
    minHeight: 'auto',
    backgroundColor: '#f5f5f5',
    // borderBottom: '1px solid #dddddd'
  }
}))(Tabs);

export const ResourceTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    minHeight: 'auto',
    minWidth: 'auto',
    paddingLeft: '10px',
    paddingRight: '5px',
    cursor: 'pointer',
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

export const ResourceTabCloseButton = withStyles({
  root: {
    padding: '3px',
    fontSize: '1em',
  }
})(IconButton);
