import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


type SnackClickEvent = React.SyntheticEvent | React.MouseEvent;

export interface SnackAlertProps {
  msg?: string;
  onClose?(event?: SnackClickEvent, reason?: string): void;
}


export const SnackAlert:React.FC<SnackAlertProps> = ({msg, onClose}) => {
  const [open, setOpen] = React.useState(false);

  useEffect(()=> {
    if (msg) setOpen(true)
  }, [msg, setOpen])

  const handleClose: SnackAlertProps['onClose'] = (event, reason) => {
    onClose ? onClose(event, reason) : setOpen(false)
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={!!msg && open}
      autoHideDuration={5000}
      onClose={onClose}
      message={msg}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
}
