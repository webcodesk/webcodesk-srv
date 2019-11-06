import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import TableRow from '@material-ui/core/TableRow';

export const ActionsLogChip = withStyles(theme => ({
  root: {
    height: '20px',
    borderRadius: '4px',
    backgroundColor: '#f1f1f1',
    fontWeight: 'bold'
  },
  label: {
    paddingLeft: '6px',
    paddingRight: '6px',
  }
}))(Chip);

export const ActionsLogTableRow = withStyles(theme => ({
  root: {
    height: '32px',
  },
}))(TableRow);

export const ActionsLogTableRowSelected = withStyles(theme => ({
  root: {
    height: '32px',
    backgroundColor: '#E3F2FD',
  }
}))(TableRow);

export const ActionsLogTableRowHighlighted = withStyles(theme => ({
  root: {
    height: '32px',
    backgroundColor: '#fff59d',
  },
}))(TableRow);

export const ActionsLogCellButton = withStyles(theme => ({
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
