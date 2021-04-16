import React, { ReactNode } from 'react';
import Alert, { Color } from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface IProps {
  open: boolean;
  title: ReactNode;
  message: ReactNode;
  severity?: Color;
  handleClose: () => void;
}

function ErrorMessage(props: IProps) {
  const { open, handleClose, title, message, severity } = props;

  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <AlertTitle><strong>{title}</strong></AlertTitle>
        {message}
      </Alert>
    </Collapse>
  );
}

export default ErrorMessage;