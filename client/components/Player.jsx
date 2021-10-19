import React, { useRef, useState, useEffect } from "react"
import { ReactReader } from "react-reader"
import Controls from "./Controls.jsx"

// Books
const accessible = "https://blueocean.s3.us-west-1.amazonaws.com/accessible_epub_3+(1).epub";
const moby = "https://s3.amazonaws.com/moby-dick/OPS/package.opf";
const alice = "https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf";

console.log(responsiveVoice.enableEstimationTimeout);
responsiveVoice.enableEstimationTimeout = false;
console.log(responsiveVoice.enableEstimationTimeout);

console.log(responsiveVoice);
responsiveVoice.enableWindowClickHook();

const Player = () => {
  const [page, setPage] = useState('')
  const [location, setLocation] = useState(null)
  const [selections, setSelections] = useState([])
  // const currentRenditionText = useRef('');
  // const remainingRenditionText = useRef('');

  /**************************************************************************************************************
  NOTE: We need to keep track of a 'playing' state/ref which gets updated when whenever we click on the pause/resume buttons.
  When speech is playing, we don't want to be able to hit the resume button again (otherwise it'll re-start the speech).
  ***************************************************************************************************************/
  const [isPlaying, setPlaying] = useState(false);
  // const [volume, setVolume] = useState(.1);
  const volumeRef = useRef(0.1);
  const responsiveVoiceTextArray = useRef([]);
  const responsiveVoiceCurrentMsgIndex = useRef(null);
  const remainingText = useRef('');

  const renditionRef = useRef(null)
  const tocRef = useRef(null)

  // Callback stuff
  function voiceStartCallback() {
    console.log("Voice started");
  }

  var parameters = {
    onstart: voiceStartCallback,
    onend: voiceEndCallback,
    onpause: voicePauseCallback,
    onresume: voiceResumeCallback,
    volume: volumeRef.current,
  }

  function voiceEndCallback() {
    console.log("Voice ended");
    var audio = document.getElementById('audio');
    audio.play();
    setTimeout(() => {
      if (renditionRef.current) {
        renditionRef.current.next()
      }
    }, 400);
  }

  function voicePauseCallback() {
    console.log("Voice paused");
  }

  function voiceResumeCallback() {
    console.log("Voice resumed");
  }

  const handlePause = (e) => {
    if (isPlaying) {
      e.preventDefault();
      responsiveVoiceTextArray.current = responsiveVoice.multipartText;
      responsiveVoiceCurrentMsgIndex.current = responsiveVoice.currentMsg.rvIndex;
      remainingText.current = responsiveVoiceTextArray.current.slice(responsiveVoiceCurrentMsgIndex.current).join('');
      responsiveVoice.cancel();
      console.log('clicked to pause');
      console.log('current responsiveVoice', responsiveVoice)
      console.log('current message', responsiveVoice.currentMsg)
      console.log('current message text', responsiveVoice.currentMsg.text)
      console.log('responsiveVoiceTextArray.current', responsiveVoiceTextArray.current);
      console.log('responsiveVoiceCurrentMsgIndex.current', responsiveVoiceCurrentMsgIndex.current);
      console.log('remainingText.current', remainingText.current);
      setPlaying(false);
    }
  }

  const handleResume = (e) => {
    if (!isPlaying) {
      e.preventDefault();
      responsiveVoice.clickEvent();
      responsiveVoice.speak(remainingText.current, "UK English Female", parameters);
      console.log('clicked to resume');
      console.log('current responsiveVoice', responsiveVoice)
      console.log('current message', responsiveVoice.currentMsg)
      console.log('current message text', responsiveVoice.currentMsg.text)
      console.log('responsiveVoiceTextArray.current', responsiveVoiceTextArray.current);
      console.log('responsiveVoiceCurrentMsgIndex.current', responsiveVoiceCurrentMsgIndex.current);
      console.log('remainingText.current', remainingText.current);
      setPlaying(true);
    }
  }

  const locationChanged = (epubcifi) => {
    responsiveVoice.cancel();
    if (renditionRef.current && tocRef.current) {
      const { displayed, href } = renditionRef.current.location.start
      const chapter = tocRef.current.find((item) => item.href === href)
      setPage(`Page ${displayed.page} of ${displayed.total} in chapter ${chapter ? chapter.label : 'n/a'}`)
      setLocation(epubcifi)

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
        remainingText.current = text;
        console.log('text', text);
        // console.log(text === "\n  ")
        if (remainingText.current && remainingText.current.length > 0 && remainingText.current !== "\n  ") {
          // currentRenditionText.current = text;
          responsiveVoice.speak(remainingText.current, "UK English Female", parameters);
          setPlaying(true);
        }
      })
    }
  }

  const handleIncrease = (e) => {
    console.log('increase detected')
    e.preventDefault();
    volumeRef.current = 1;
    responsiveVoiceTextArray.current = responsiveVoice.multipartText;
    responsiveVoiceCurrentMsgIndex.current = responsiveVoice.currentMsg.rvIndex;
    remainingText.current = responsiveVoiceTextArray.current.slice(responsiveVoiceCurrentMsgIndex.current).join('');
    responsiveVoice.cancel();
    responsiveVoice.speak(remainingText.current, "UK English Female", parameters);
    // responsiveVoice.msgparameters.volume = 1;
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
          url={alice}
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
        <button onClick={handleIncrease}>Increase Volume</button>
        <Controls handleResume={handleResume} handlePause={handlePause} handleIncrease={handleIncrease} />
      </div>
    </>
  )
}

export default Player