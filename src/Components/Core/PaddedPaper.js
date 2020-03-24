import { Paper } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'

const styles = theme => ({
  paper: {
    padding: '2rem',
    overflow: 'hidden',
    borderRadius: 0,
    boxShadow: 'none'
  }
})

const PaddedPaper = ({ classes, children, className }) => <Paper className={`${classes.paper} ${className}`}>
  {children}
</Paper>

export default withStyles(styles)(PaddedPaper)
