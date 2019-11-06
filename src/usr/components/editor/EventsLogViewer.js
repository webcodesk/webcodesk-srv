import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SplitPane from '../splitPane';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import {
  ActionsLogTableRow,
  ActionsLogTableRowSelected,
} from './ActionsLogViewer.parts';
import AutoScrollPanel from '../commons/AutoScrollPanel';
import ToolbarButton from '../commons/ToolbarButton';
import { CommonToolbar } from '../commons/Commons.parts';

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
  recordsDeleteButton: {
    position: 'absolute',
    bottom: '1em',
    right: '1em',
    zIndex: 5,
  },
  centralPane: {
    position: 'absolute',
    top: '39px',
    bottom: 0,
    right: 0,
    left: 0,
  },
  topPane: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '39px',
    right: 0,
  },
});

class EventsLogViewer extends React.Component {
  static propTypes = {
    lastRecord: PropTypes.object,
  };

  static defaultProps = {
    lastRecord: {},
  };

  constructor (props) {
    super(props);
    this.state = {
      records: [],
      selectedRecordId: undefined,
      selectedRecord: undefined,
      scrollToRecordId: undefined,
    };
  }

  componentDidMount () {
    const { lastRecord } = this.props;
    if (lastRecord) {
      this.addNewRecord(lastRecord);
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { lastRecord } = this.props;
    if (lastRecord !== prevProps.lastRecord) {
      this.addNewRecord(lastRecord);
    }
  }

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

  createEventCell = (record) => {
    const { eventName } = record;
    return (
      <TableCell>
        {eventName}
      </TableCell>
    );
  };

  createFormattedData = (data) => {
    let value;
    if (isString(data)) {
      value = (
        <pre>
          <code>"{data}"</code>
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
          <code>{codeString}</code>
        </pre>
      );
    } else {
      value = (
        <pre>
          <code>{data}</code>
        </pre>
      );
    }
    return value;
  };

  createDataView = () => {
    const { selectedRecord } = this.state;
    let title = 'No data';
    if (selectedRecord) {
      const { args } = selectedRecord;
      let value;
      if (!isUndefined(args)) {
        title = 'Output:';
        value = this.createFormattedData(args);
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
      selectedRecordId: record.timestamp,
      selectedRecord: record,
    });
  };

  handleClearRecords = () => {
    this.setState({
      selectedRecordId: null,
      selectedRecord: null,
      records: [],
      scrollToRecordId: '',
    });
  };

  addNewRecord = (record) => {
    const records = [...this.state.records];
    records.push(record);
    this.setState({
      selectedRecordId: record.timestamp,
      selectedRecord: record,
      records,
      scrollToRecordId: `${record.timestamp}`,
    });
  };

  render () {
    const { selectedRecordId, scrollToRecordId, records } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.topPane}>
          <CommonToolbar disableGutters={true} dense="true">
            <ToolbarButton
              iconType="Delete"
              title="Clear log"
              onClick={this.handleClearRecords}
              tooltip="Clear log records"
            />
          </CommonToolbar>
        </div>
        <div className={classes.centralPane}>
          <SplitPane
            split="vertical"
            defaultSize="50%"
            primary="second"
          >
            <div className={classes.root}>
              <AutoScrollPanel elementId={scrollToRecordId}>
                <div>
                  <Table className={classes.table} padding="dense">
                    <TableBody>
                      {records.map(record => {
                        if (record.timestamp === selectedRecordId) {
                          return (
                            <ActionsLogTableRowSelected
                              id={record.timestamp}
                              key={record.timestamp}
                              hover={true}
                              onClick={this.handleRowClick(record)}
                            >
                              {this.createTimeCell(record)}
                              {this.createEventCell(record)}
                              <TableCell/>
                            </ActionsLogTableRowSelected>
                          );
                        }
                        return (
                          <ActionsLogTableRow
                            id={record.timestamp}
                            key={record.timestamp}
                            hover={true}
                            onClick={this.handleRowClick(record)}
                          >
                            {this.createTimeCell(record)}
                            {this.createEventCell(record)}
                            <TableCell/>
                          </ActionsLogTableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div style={{ width: '100%', height: '50px' }}/>
                </div>
              </AutoScrollPanel>
            </div>
            <div className={classes.dataPane}>
              {this.createDataView()}
            </div>
          </SplitPane>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(EventsLogViewer);
