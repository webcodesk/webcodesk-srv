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
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    width: '100%',
    paddingTop: '12px',
  },
  shortcutWrapper: {
    padding: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  regularText: {
    fontSize: '12px'
  },
  specialText: {
    fontSize: '16px'
  }
});

class PanelWithShortcutsHelp extends React.Component {
  render () {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="body1" align="center" gutterBottom={true}>
          Shortcuts
        </Typography>
        <Typography variant="body2" gutterBottom={true}>
          Delete selected component:
        </Typography>
        <pre className={classes.shortcutWrapper}>
            <span className={classes.regularText}>Delete</span>&nbsp;
          </pre>
        <Typography variant="body2" gutterBottom={true}>
          Copy into clipboard:
        </Typography>
        <pre className={classes.shortcutWrapper}>
            <span className={classes.regularText}>Ctrl + C /</span>&nbsp;
          <span className={classes.specialText}>&#8984;</span>&nbsp;
          <span className={classes.regularText}>+ C</span>
          </pre>
        <Typography variant="body2" gutterBottom={true}>
          Cut into clipboard:
        </Typography>
        <pre className={classes.shortcutWrapper}>
            <span className={classes.regularText}>Ctrl + X /</span>&nbsp;
          <span className={classes.specialText}>&#8984;</span>&nbsp;
          <span className={classes.regularText}>+ X</span>
          </pre>
        <Typography variant="body2" gutterBottom={true}>
          Paste from clipboard:
        </Typography>
        <pre className={classes.shortcutWrapper}>
            <span className={classes.regularText}>Ctrl + V /</span>&nbsp;
          <span className={classes.specialText}>&#8984;</span>&nbsp;
          <span className={classes.regularText}>+ V</span>
          </pre>
        <Typography variant="body2" gutterBottom={true}>
          Undo the last action:
        </Typography>
        <pre className={classes.shortcutWrapper}>
            <span className={classes.regularText}>Ctrl + Z /</span>&nbsp;
          <span className={classes.specialText}>&#8984;</span>&nbsp;
          <span className={classes.regularText}>+ Z</span>
          </pre>
        <Typography variant="body2" gutterBottom={true}>
          Save recent changes:
        </Typography>
        <pre className={classes.shortcutWrapper}>
            <span className={classes.regularText}>Ctrl + S /</span>&nbsp;
          <span className={classes.specialText}>&#8984;</span>&nbsp;
          <span className={classes.regularText}>+ S</span>
          </pre>
        <Typography variant="body2" gutterBottom={true}>
          Reload page:
        </Typography>
        <pre className={classes.shortcutWrapper}>
            <span className={classes.regularText}>Ctrl + R /</span>&nbsp;
          <span className={classes.specialText}>&#8984;</span>&nbsp;
          <span className={classes.regularText}>+ R</span>
          </pre>
      </div>
    );
  }
}

export default withStyles(styles)(PanelWithShortcutsHelp);
