// import React, { useState } from 'react';

// const App = () => {
//   const [name, setName] = useState('BROTHER');
//   return (
//   <div>
//     <h1>HELLO {name}</h1>
//   </div>
//   )
// }

// export default App;

// import React, { useState, useRef } from "react"
// import { ReactReader } from "react-reader"

// const App = () => {
//   // And your own state logic to persist state
//   const [location, setLocation] = useState(null)
//   const locationChanged = (epubcifi) => {
//     // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
//     setLocation(epubcifi)
//     // console.log('epubcifi', epubcifi)

//     // book.getRange(epubcifi).then(function (range) {
//     //   console.log('range', range);
//     // }
//   }

//   return (
//     <div style={{ height: "100vh" }}>
//       <ReactReader
//         location={location}
//         locationChanged={locationChanged}
//         url="https://gerhardsletten.github.io/react-reader/files/alice.epub"
//       />
//     </div>
//   )
// }

// export default App;

import React, { useRef, useState, useEffect } from "react"
import { ReactReader } from "react-reader"

// Books
const accessible = "https://blueocean.s3.us-west-1.amazonaws.com/accessible_epub_3+(1).epub";
const moby = "https://s3.amazonaws.com/moby-dick/OPS/package.opf";
const alice = "https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf";

console.log(responsiveVoice.enableEstimationTimeout);
responsiveVoice.enableEstimationTimeout = false;
console.log(responsiveVoice.enableEstimationTimeout);

console.log(responsiveVoice);
responsiveVoice.enableWindowClickHook();

const App = () => {
  const [page, setPage] = useState('')
  const [location, setLocation] = useState(null)
  const [selections, setSelections] = useState([])
  // const [currentRenditionText, setCurrentRenditionText] = useState('');
  // const [remainingRenditionText, setRemainingRenditionText] = useState('');
  // const currentRenditionText = useRef('');
  // const remainingRenditionText = useRef('');
  const responsiveVoiceTextArray = useRef([]);
  const responsiveVoiceCurrentMsgIndex = useRef(null);
  const remainingText = useRef('');

  const renditionRef = useRef(null)
  const tocRef = useRef(null)

  const handlePause = (e) => {
    e.preventDefault();
    console.log('current message', responsiveVoice.currentMsg)
    console.log('current message text', responsiveVoice.currentMsg.text)
    // remainingRenditionText.current = currentRenditionText.current.substring(currentRenditionText.current.indexOf(responsiveVoice.currentMsg.text))
    responsiveVoiceTextArray.current = responsiveVoice.multipartText;
    responsiveVoiceCurrentMsgIndex.current = responsiveVoice.currentMsg.rvIndex;
    remainingText.current = responsiveVoiceTextArray.current.slice(responsiveVoiceCurrentMsgIndex.current).join('');
    responsiveVoice.pause();
    console.log('clicked to pause');
    // console.log('currentRenditionText ref', currentRenditionText.current);
    // console.log('index of current message text in currentRenditionText ref', currentRenditionText.current.indexOf(responsiveVoice.currentMsg.text))
    // console.log('remaining message text', currentRenditionText.current.substring(currentRenditionText.current.indexOf(responsiveVoice.currentMsg.text)))
    console.log('responsiveVoiceTextArray.current', responsiveVoiceTextArray.current);
    console.log('responsiveVoiceCurrentMsgIndex.current', responsiveVoiceCurrentMsgIndex.current);
    console.log('remainingText.current', remainingText.current);
  }

  const handleResume = (e) => {
    responsiveVoice.clickEvent();
    e.preventDefault();
    responsiveVoice.cancel();
    responsiveVoiceTextArray.current = responsiveVoice.multipartText;
    responsiveVoiceCurrentMsgIndex.current = responsiveVoice.currentMsg.rvIndex;
    // const remainingText = responsiveVoiceTextArray.current.slice(responsiveVoiceCurrentMsgIndex.current).join('');
    remainingText.current = responsiveVoiceTextArray.current.slice(responsiveVoiceCurrentMsgIndex.current).join('');
    // responsiveVoice.speak(remainingText, "UK English Female");
    responsiveVoice.speak(remainingText.current, "UK English Female");
    // responsiveVoice.speak(remainingRenditionText.current, "UK English Female");
    // responsiveVoice.resume();
    console.log('clicked to resume');
    // console.log('current responsiveVoice', responsiveVoice)
    // console.log('current message', responsiveVoice.currentMsg)
    // console.log('remainingRenditionText', remainingRenditionText.current)
    // console.log('remainingText', remainingText)
    console.log('responsiveVoiceTextArray.current', responsiveVoiceTextArray.current);
    console.log('responsiveVoiceCurrentMsgIndex.current', responsiveVoiceCurrentMsgIndex.current);
    console.log('remainingText.current', remainingText.current);
  }

  const locationChanged = (epubcifi) => {
    responsiveVoice.cancel();
    if (renditionRef.current && tocRef.current) {
      const { displayed, href } = renditionRef.current.location.start
      const chapter = tocRef.current.find((item) => item.href === href)
      setPage(`Page ${displayed.page} of ${displayed.total} in chapter ${chapter ? chapter.label : 'n/a'}`)
      setLocation(epubcifi)

      // Callback stuff
      function voiceStartCallback() {
        console.log("Voice started");
      }

      function voiceEndCallback() {
        console.log("Voice ended");
        var audio = document.getElementById('audio');
        audio.play();
        setTimeout(() => { renditionRef.current.next() }, 400);
      }

      function voicePauseCallback() {
        console.log("Voice paused");
      }

      function voiceResumeCallback() {
        console.log("Voice resumed");
      }

      var parameters = {
        onstart: voiceStartCallback,
        onend: voiceEndCallback,
        onpause: voicePauseCallback,
        onresume: voiceResumeCallback,
        volume: 1
      }

      // console.log('current rendition', renditionRef.current)
      // console.log('current book', renditionRef.current.book)
      // console.log('current book "getRange"', renditionRef.current.book.getRange)

      // console.log('current location', renditionRef.current.location)
      // console.log('current location start', renditionRef.current.location.start)
      // console.log('current location end', renditionRef.current.location.end)

      // console.log('current location start cfi', renditionRef.current.location.start.cfi)
      // console.log('current location end cfi', renditionRef.current.location.end.cfi)

      const locationStartCfi = renditionRef.current.location.start.cfi;
      const locationEndCfi = renditionRef.current.location.end.cfi;


      /**************************************************************************************************************
      NOTE: Need to use a function to find the greatest common base string between the two start/end rage cfi's for the "breakpoint"
      ***************************************************************************************************************/
      const breakpoint = locationStartCfi.indexOf(']!') + 6;
      const base = locationStartCfi.substring(0, breakpoint);
      const startRange = locationStartCfi.substring(breakpoint, locationStartCfi.length - 1);
      const endRange = locationEndCfi.substring(breakpoint, locationEndCfi.length);
      const cfiRange = `${base},${startRange},${endRange}`;

      // console.log('base', base);
      // console.log('startRange', startRange);
      // console.log('endRange', endRange);
      // console.log('cfiRange', cfiRange);

      renditionRef.current.book.getRange(cfiRange).then(function (range) {
        console.log('range', range);
        let text = range.toString()
        console.log('text', text);
        // console.log(text === "\n  ")
        if (text && text.length > 0 && text !== "\n  ") {
          // currentRenditionText.current = text;
          responsiveVoice.speak(text, "UK English Female", parameters);
        }
      })
    }
  }

  useEffect(() => {
    if (renditionRef.current) {
      function setRenderSelection(cfiRange, contents) {
        console.log('cfiRange', cfiRange)
        console.log('contents', contents)
        setSelections(selections.concat({
          text: renditionRef.current.getRange(cfiRange).toString(),
          cfiRange
        }))
        // renditionRef.current.annotations.add("highlight", cfiRange, {}, null, "hl", { "fill": "red", "fill-opacity": "0.5", "mix-blend-mode": "multiply" })
        renditionRef.current.annotations.add("highlight", cfiRange, {}, null, "hl", { "fill": "red", "fill-opacity": "0.5" })
        contents.window.getSelection().removeAllRanges()
      }
      renditionRef.current.on("selected", setRenderSelection)
      return () => {
        renditionRef.current.off("selected", setRenderSelection)
      }
    }
  }, [setSelections, selections])

  return (
    <>
      <div style={{ height: "100vh" }}>
        <ReactReader
          location={location}
          locationChanged={locationChanged}
          url={moby}
          getRendition={(rendition) => {
            renditionRef.current = rendition
            renditionRef.current.themes.default({
              '::selection': {
                'background': 'orange'
              }
            })
            setSelections([])
          }}
          tocChanged={toc => tocRef.current = toc}
        />
      </div>
      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', left: '1rem', textAlign: 'center', zIndex: 1 }}>
        {page}
        {/* Selection:
        <ul>
          {selections.map(({ text, cfiRange }, i) => (
            <li key={i}>
              {text} <button onClick={() => {
                renditionRef.current.display(cfiRange)
              }}>Show</button>
              <button onClick={() => {
                renditionRef.current.annotations.remove(cfiRange, 'highlight')
                setSelections(selections.filter((item, j) => j !== i))
              }}>x</button>
            </li>
          ))}
        </ul> */}
        <div id="audio-controls">
          <img id="resume-button" className="audio-button" src="../assets/icons8-play-100.png" onClick={handleResume} />
          <img id="pause-button" className="audio-button" src="../assets/icons8-pause-100.png" onClick={handlePause} />
        </div>
      </div>
    </>
  )
}

export default App;
