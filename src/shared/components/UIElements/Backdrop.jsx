import React from 'react'
import ReactDom from 'react-dom'

import './Backdrop.css'

function Backdrop(props) {
  return ReactDom.createPortal (
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook')
  );
};

export default Backdrop
