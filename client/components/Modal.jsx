import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ showModal, setShowModal, setParameters, setSize, size, parameters, handlePause }) => {
  if (!showModal) return null;
  return ReactDOM.createPortal(
    <div>
      <button onClick={() => setShowModal(false)}>X</button>
      <button onClick={() => { setSize(Math.max(70, size - 10)); handlePause();}}>-</button>
      <span>Current size: {size}%</span>
      <button onClick={() => { setSize(Math.min(200, size + 10)); handlePause();}}>+</button>
      <label for="pitch">Pitch</label>
      <input
        id="pitch"
        type="range"
        min={0.1}
        max={2}
        step={0.1}
        value={parameters.pitch}
        onChange={(e) => {
          e.preventDefault();
          setParameters({
          onstart: parameters.onstart,
          onend: parameters.onend,
          volume: parameters.volume,
          rate: parameters.rate,
          pitch: e.target.value,
        }); handlePause()}}
      /><br></br>
      <label for="rate">Rate</label>
      <input
        id="rate"
        type="range"
        min={0.1}
        max={2}
        step={0.1}
        value={parameters.rate}
        onChange={(e) => {
          e.preventDefault();
          setParameters({
          onstart: parameters.onstart,
          onend: parameters.onend,
          volume: parameters.volume,
          rate: e.target.value,
          pitch: parameters.pitch,
        }); handlePause()}}
      />
    </div>,
    document.getElementById('portal'),
  );
};

export default Modal;