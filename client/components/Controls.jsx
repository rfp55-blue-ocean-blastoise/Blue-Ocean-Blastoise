import React, { useRef, useState, useEffect } from "react"
import { ReactReader } from "react-reader"

const Controls = ({ handleResume, handlePause, handleVolumeChange, parameters, setShowModal }) => {

  return (
    <div id="audio-controls">
      {/* <button onClick={handleIncrease}>Volume +</button>
      <button onClick={handleDecrease}>Volume -</button>
      <button onClick={handleIncrease}>Submit Volume +</button> */}
      <img id="resume-button" className="audio-button" src="../assets/icons8-play-100.png" onClick={handleResume} />
      <img id="pause-button" className="audio-button" src="../assets/icons8-pause-100.png" onClick={handlePause} />
      <button onClick={() => setShowModal(true)}>Open Settings</button>
      <div className="slidecontainer">
        <input type="range" min="0" max="1" value={parameters.volume} step="0.1" className="slider" id="myRange" onChange={handleVolumeChange}/>
        {/* <input type="range" min="0" max="100" value="50" step="10" className="slider" id="myRange" onChange={handleVolumeChange}/> */}

      </div>
    </div>
  )
}

export default Controls