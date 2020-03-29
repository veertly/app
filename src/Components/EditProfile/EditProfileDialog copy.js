import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default props => {
  const {open, setOpen} = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button size='large' onClick={handleClickOpen}>
        Edit Profile
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Edit Profile</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='Email Address'
              type='email'
            />
          </div>
          <div>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='Twitter'
              type='email'
            />
          </div>
          <div>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='Linkedin'
              type='email'
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleClose} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
