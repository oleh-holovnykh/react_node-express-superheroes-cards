import { Modal, Box } from '@mui/material';
import React from 'react';

interface Props {
  isOpen: boolean,
  handleClose: () => void,
}

const styles = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'content-width',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

export const CustomModal: React.FC<Props> = ({ isOpen, handleClose, children }) => (
  <Modal
    open={isOpen}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={styles}>
      {children}
    </Box>
  </Modal>
);
