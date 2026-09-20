import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { consume, isBack, navigateControls, remoteKey } from '../remote';
import './DifficultyModal.css';

export function RemoteDialog({ open, title, onClose, children }) {
  return <Dialog open={open} onClose={onClose || (() => {})} onKeyDown={event => {
    if (isBack(remoteKey(event)) && onClose) {
      consume(event);
      if (!event.repeat) onClose();
    } else navigateControls(event);
  }}>
    <div className="modal-overlay"><DialogPanel className="modal-content">
      <DialogTitle>{title}</DialogTitle>
      {children}
    </DialogPanel></div>
  </Dialog>;
}
