import React, {ReactChildren} from 'react';
import './Modal.css';
import ReactDOM from "react-dom/client";
import {AppProvider} from "../context";
import App from "../App";
import {createPortal} from "react-dom";

export interface IModalProps {
  children: any,
  className?: string
}

const Modal: React.FunctionComponent<IModalProps> = ({children, className = ''}) => {
  return createPortal(
    <div className={`modal-background ${className}`}>
      <div className='modal-container'>
        <h2>Modal</h2>
        { children }
      </div>
    </div>,
    document.getElementById("portal")!
  );
}

export default Modal;