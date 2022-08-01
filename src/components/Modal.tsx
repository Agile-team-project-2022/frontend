import React, {ReactNode} from 'react';
import './Modal.css';
import {createPortal} from "react-dom";

export interface IModalProps {
  children: ReactNode,
  onClose: () => void,
  className?: string
}

const Modal: React.FunctionComponent<IModalProps> = ({children, onClose, className = ''}) => {
  return createPortal(
    <div className='modal-background'>
      <div className={`modal-container ${className}`} >
        <header className='modal-header'
                onClick={() => onClose()}
        >
          <div> </div>
          <span> Go back </span>
        </header>

        <div className='modal-content'>
          { children }
        </div>
      </div>
      <div className='modal-shadow-bottom'> </div>
    </div>,
    document.getElementById("portal")!
  );
}

export default Modal;