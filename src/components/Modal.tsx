import React, {ReactNode} from 'react';
import './Modal.css';
import {createPortal} from "react-dom";

export interface IModalProps {
  children: ReactNode,
  onClose: ((e: React.MouseEvent) => void) | (() => void),
  className?: string
}

const Modal: React.FunctionComponent<IModalProps> = ({children, onClose, className = ''}) => {
  return createPortal(
    <div className='modal-background' onClick={onClose}>
      <div className={`modal-container ${className}`} >
        <header className='modal-header'
                onClick={onClose}
        >
          <div> </div>
          <span> Go back </span>
        </header>

        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
          { children }
        </div>
      </div>
      <div className='modal-shadow-bottom'> </div>
    </div>,
    document.getElementById("portal")!
  );
}

export default Modal;