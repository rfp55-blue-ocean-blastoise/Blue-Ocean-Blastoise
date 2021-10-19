import React, { useRef, useState, useEffect } from "react"
import { ReactReader } from "react-reader"

const Controls = ({handleResume, handlePause}) => {

  return (
    <div id="audio-controls">
      <img id="resume-button" className="audio-button" src="../assets/icons8-play-100.png" onClick={handleResume} />
      <img id="pause-button" className="audio-button" src="../assets/icons8-pause-100.png" onClick={handlePause} />
    </div>
  )
}

export default Controls