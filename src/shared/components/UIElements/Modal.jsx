import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
import Backdrop from './Backdrop';
import { CSSTransition } from 'react-transition-group';

// Modal Overlay Component
function ModalOverlay(props) {
  return (
    <div
      className={`modal ${props.className}`}
      style={props.style}
      ref={props.nodeRef}
    >
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (e) => e.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
}

// Modal wrapper with backdrop and animation
function Modal(props) {
  const nodeRef = useRef(null);

  return (
    <>
      {props.show && <Backdrop onClick={props.Cancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
        nodeRef={nodeRef}
      >
        {/* 👇 Only ONE element is returned inside CSSTransition */}
        <ModalOverlay {...props} nodeRef={nodeRef} />
      </CSSTransition>
    </>
  );
}

export default Modal;
