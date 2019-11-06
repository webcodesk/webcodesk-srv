import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import SplitPane from '../splitPane';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import * as constants from '../../../commons/constants';
import ResourceIcon from '../commons/ResourceIcon';
import {
  ActionsLogChip,
  ActionsLogCellButton,
  ActionsLogTableRow,
  ActionsLogTableRowHighlighted
} from './ActionsLogViewer.parts';
import AutoScrollPanel from '../commons/AutoScrollPanel';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  pane: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    overflow: 'auto'
  },
  dataPane: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    padding: '0.5em',
    overflow: 'auto'
  },
  cellContent: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cellContentIcon: {
    flexGrow: 0,
    marginRight: '5px',
  },
  cellContentText: {
    flexGrow: 2,
    textAlign: 'left',
  },
  table: {
    position: 'relative',
  },
  eyeCell: {
    width: '30px',
    padding: '4px 0px 4px 10px',
  }
});

class ActionsLogViewer extends React.Component {
  static propTypes = {
    actionsLog: PropTypes.array,
    highlightedRecords: PropTypes.array,
    onParticleClick: PropTypes.func,
  };

  static defaultProps = {
    actionsLog: [],
    highlightedRecords: [],
    onParticleClick: () => {
      console.info('ActionsLogViewer.onParticleClick is not set');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      selectedRecordId: undefined,
      selectedRecord: undefined,
      scrollToRecordId: undefined,
    };
  }

  componentDidMount () {
    const { highlightedRecords } = this.props;
    if (highlightedRecords && highlightedRecords.length > 0) {
      this.makeFirstSelection(highlightedRecords[0]);
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { highlightedRecords } = this.props;
    if (highlightedRecords !== prevProps.highlightedRecords) {
      if (highlightedRecords && highlightedRecords.length > 0) {
        this.makeFirstSelection(highlightedRecords[0]);
      }
    }
  }

  createEyeCell = (isViewed) => {
    const {classes} = this.props;
    return (
      <TableCell className={classes.eyeCell}>
        {isViewed ? <RemoveRedEye fontSize="small" /> : <span />}
      </TableCell>
    );
  };

  createTimeCell = (record) => {
    const { timestamp } = record;
    const time = new Date(timestamp);
    let minutes = time.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    let hours = time.getHours();
    hours = hours < 10 ? `0${hours}` : hours;
    let seconds = time.getSeconds();
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    let milliseconds = time.getMilliseconds();
    return (
      <TableCell>{`${hours}:${minutes}:${seconds}.${milliseconds}`}</TableCell>
    );
  };

  createParticleCell = (record) => {
    const { classes } = this.props;
    const { key, componentInstance, functionName, forwardPath } = record;
    let functionTitle = functionName;
    if (functionTitle) {
      const titleParts = functionTitle.split(constants.MODEL_KEY_SEPARATOR);
      functionTitle = titleParts[titleParts.length - 1];
    }
    let resourceIcon;
    if (componentInstance) {
      resourceIcon = (
        <ResourceIcon resourceType={constants.GRAPH_MODEL_COMPONENT_INSTANCE_TYPE}/>
      );
    } else if (functionName) {
      resourceIcon = (
        <ResourceIcon resourceType={constants.GRAPH_MODEL_USER_FUNCTION_TYPE}/>
      );
    } else if (forwardPath) {
      resourceIcon = (
        <ResourceIcon resourceType={constants.GRAPH_MODEL_PAGE_TYPE}/>
      );
    } else {
      resourceIcon = (
        <ResourceIcon/>
      );
    }
    return (
      <TableCell align="left">
        <div className={classes.cellContent}>
          <div className={classes.cellContentIcon}>
            {resourceIcon}
          </div>
          <div className={classes.cellContentText}>
            <ActionsLogCellButton
              size="small"
              color={key ? 'primary' : 'default'}
              onClick={key ? this.handleParticleClick(key) : this.handleNoop}
            >
              {componentInstance || functionTitle || forwardPath}
            </ActionsLogCellButton>
          </div>
        </div>
      </TableCell>
    );
  };

  createEventCell = (record) => {
    const { classes } = this.props;
    const { eventType, eventName, propertyName } = record;
    if (eventType === constants.DEBUG_MSG_CREATE_CONTAINER_EVENT) {
      return (
        <TableCell>
          populate props
        </TableCell>
      );
    } else if (eventType === constants.DEBUG_MSG_FORWARD_EVENT) {
      return (
        <TableCell>
          forward
        </TableCell>
      );
    } else if (eventType === constants.DEBUG_MSG_FUNCTION_FIRE_EVENT) {
      return (
        <TableCell>
          <div className={classes.cellContent}>
            <div className={classes.cellContentIcon}>
              dispatch
            </div>
            <div className={classes.cellContentText}>
              <ActionsLogChip label={eventName}/>
            </div>
          </div>
        </TableCell>
      );
    } else if (eventType === constants.DEBUG_MSG_FUNCTION_CALL_EVENT) {
      return (
        <TableCell>
          call function
        </TableCell>
      );
    } else if (eventType === constants.DEBUG_MSG_COMPONENT_FIRE_EVENT) {
      return (
        <TableCell>
          <div className={classes.cellContent}>
            <div className={classes.cellContentIcon}>
              fire
            </div>
            <div className={classes.cellContentText}>
              <ActionsLogChip label={eventName}/>
            </div>
          </div>
        </TableCell>
      );
    } else if (eventType === constants.DEBUG_MSG_REDUCE_DATA_EVENT) {
      return (
        <TableCell>
          <div className={classes.cellContent}>
            <div className={classes.cellContentIcon}>
              reduce prop
            </div>
            <div className={classes.cellContentText}>
              <ActionsLogChip label={propertyName}/>
            </div>
          </div>
        </TableCell>
      );
    } else if (eventType === constants.DEBUG_MSG_NEW_PROPS_EVENT) {
      return (
        <TableCell>
          receive props
        </TableCell>
      );
    } else if (eventType === constants.DEBUG_MSG_APPLICATION_START_EVENT) {
      return (
        <TableCell>
          start application
        </TableCell>
      );
    } else {
      return (
        <TableCell>
          some event
        </TableCell>
      );
    }
  };

  createFormattedData = (data) => {
    let value;
    if (isString(data)) {
      value = (
        <pre>
          <code>
            "{data}"
          </code>
        </pre>
      );
    } else if (isObject(data) || isArray(data)) {
      let codeString;
      try {
        codeString = JSON.stringify(data, null, 2);
      } catch (e) {
        // do nothing
      }
      value = (
        <pre>
          <code>
            {codeString}
          </code>
        </pre>
      );
    } else {
      let codeString;
      try {
        codeString = JSON.stringify(data, null, 2);
      } catch (e) {
        // do nothing
      }
      value = (
        <pre>
          <code>{codeString}</code>
        </pre>
      );
    }
    return value;
  };

  createDataView = () => {
    const { selectedRecord } = this.state;
    let title = 'No data';
    if (selectedRecord) {
      const { inputData, outputData, pathString } = selectedRecord;
      let value;
      if (!isUndefined(pathString)) {
        title = 'Forward path:';
        value = this.createFormattedData(pathString);
      } else if (!isUndefined(inputData) || !isUndefined(outputData)) {
        title = !isUndefined(inputData) ? 'Input:' : 'Output:';
        value = this.createFormattedData(!isUndefined(inputData) ? inputData : outputData);
      }
      return (
        <div>
          <Typography variant="overline" gutterBottom>
            {title}
          </Typography>
          <div>{value}</div>
        </div>
      );
    }
    return (
      <div>
        <Typography variant="overline" gutterBottom>
          {title}
        </Typography>
      </div>
    );
  };

  handleRowClick = (record) => () => {
    this.setState({
      selectedRecordId: record.recordId,
      selectedRecord: record,
    });
  };

  handleParticleClick = (key) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onParticleClick(key);
  };

  handleNoop = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  makeFirstSelection = (recordId) => {
    const foundRecord = this.props.actionsLog.find(i => i.recordId === recordId);
    if (foundRecord) {
      this.setState({
        scrollToRecordId: recordId,
        selectedRecordId: foundRecord.recordId,
        selectedRecord: foundRecord,
      });
    }
  };

  render () {
    const { selectedRecordId, scrollToRecordId } = this.state;
    const { classes, actionsLog, highlightedRecords } = this.props;
    return (
      <div className={classes.root}>
        <SplitPane
          split="vertical"
          defaultSize={250}
          primary="second"
        >
          <AutoScrollPanel elementId={scrollToRecordId}>
            <Table className={classes.table} padding="dense">
              <TableBody>
                {actionsLog.map((record, idx) => {
                  if (highlightedRecords.indexOf(record.recordId) >= 0) {
                    return (
                      <ActionsLogTableRowHighlighted
                        id={record.recordId}
                        key={`${record.recordId}_${idx}`}
                        hover={true}
                        onClick={this.handleRowClick(record)}
                      >
                        {this.createEyeCell(record.recordId === selectedRecordId)}
                        {this.createTimeCell(record)}
                        {this.createParticleCell(record)}
                        {this.createEventCell(record)}
                        <TableCell/>
                      </ActionsLogTableRowHighlighted>
                    );
                  }
                  return (
                    <ActionsLogTableRow
                      id={record.recordId}
                      key={`${record.recordId}_${idx}`}
                      hover={true}
                      onClick={this.handleRowClick(record)}
                    >
                      {this.createEyeCell(record.recordId === selectedRecordId)}
                      {this.createTimeCell(record)}
                      {this.createParticleCell(record)}
                      {this.createEventCell(record)}
                      <TableCell/>
                    </ActionsLogTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </AutoScrollPanel>
          <div className={classes.dataPane}>
            {this.createDataView()}
          </div>
        </SplitPane>
      </div>
    );
  }
}

export default withStyles(styles)(ActionsLogViewer);
