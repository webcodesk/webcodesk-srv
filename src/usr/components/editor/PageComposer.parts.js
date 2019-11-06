import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export const StructureTabs = withStyles(theme => ({
  root: {
    minHeight: 'auto',
    minWidth: '190px',
    backgroundColor: '#f5f5f5',
  }
}))(Tabs);

export const StructureTab = withStyles(theme => ({
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
  selected: {
    backgroundColor: theme.palette.background.paper,
  }
}))(Tab);
