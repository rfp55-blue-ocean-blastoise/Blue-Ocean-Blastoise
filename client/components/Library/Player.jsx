import React, { useRef, useState, useEffect } from "react";
import { ReactReader } from "react-reader";
import axios from 'axios';
import Button from '@mui/material/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

// Books
const accessible = "https://blueocean.s3.us-west-1.amazonaws.com/accessible_epub_3+(1).epub";
const moby = "https://s3.amazonaws.com/moby-dick/OPS/package.opf";
const alice = "https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf";

console.log(responsiveVoice.enableEstimationTimeout);
responsiveVoice.enableEstimationTimeout = false;
console.log(responsiveVoice.enableEstimationTimeout);


const Player = (props) => {
  const [page, setPage] = useState('')
  const [location, setLocation] = useState(null)
  const [selections, setSelections] = useState([])

  const renditionRef = useRef(null)
  const tocRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeValue, setVolumeValue] = useState(30);

  const handleSkipNext = (e) => {
    e.preventDefault();
    console.log('SKIP NEXT code');
  }

  const handleSkipPrevious = (e) => {
    e.preventDefault();
    console.log('SKIP PREVIOUS code');
  }

  const handleVolumeChange = (e) => {
    e.preventDefault();
    setVolumeValue(e.target.value);
    console.log('This is volume value', volumeValue);
  }

  const handlePause = (e) => {
    e.preventDefault();
    responsiveVoice.pause();
    setIsPlaying(false);
    console.log('clicked to pause');
  }

  const handleResume = (e) => {
    e.preventDefault();
    responsiveVoice.resume();
    setIsPlaying(true);
    console.log('clicked to resume');
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
        axios.post('/audio', {data: text})
          .then((res) => console.log(res))
          .catch((err) => console.error(err));
        // console.log(text === "\n  ")
        if (text && text.length > 0 && text !== "\n  ") {
          responsiveVoice.speak(text, "UK English Female", parameters);
        }
      }).catch((err) => {
        console.error(err);
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
        renditionRef.current.annotations.add("highlight", cfiRange, {}, null, "hl", { "fill": "red", "fill-opacity": "0.5"})
        contents.window.getSelection().removeAllRanges()
      }
      renditionRef.current.on("selected", setRenderSelection)
      return () => {
        renditionRef.current.off("selected", setRenderSelection)
      }
    }
  }, [setSelections, selections])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div style={{ height: '90vh' }}>
        <ReactReader
          location={location}
          locationChanged={locationChanged}
          url={props.book.link}
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
      <div style={{ textAlign: 'center', padding: '2rem', zIndex: 1, backgroundColor: '#FFFDD0' }}>
        {page}
        <h1>{props.book.title}</h1>
        <div id="audio-controls">
          <Button
            style={{ marginRight: '1rem', backgroundColor: '#11A797' }}
            variant='contained'
            type='button'
            onClick={handleSkipPrevious}
          >
            <SkipPreviousIcon />
          </Button>
          {isPlaying ? (
            <Button
              style={{ marginRight: '1rem', backgroundColor: '#11A797' }}
              variant='contained'
              type='button'
              onClick={handlePause}
            >
              <PauseCircleOutlineIcon />
            </Button>
          ) : (
            <Button
              style={{ marginRight: '1rem', backgroundColor: '#11A797' }}
              variant='contained'
              type='button'
              onClick={handleResume}
            >
              <PlayCircleOutlineIcon />
            </Button>
          )}
          <Button
            style={{ marginRight: '1rem', backgroundColor: '#11A797' }}
            variant='contained'
            type='button'
            onClick={handleSkipNext}
          >
            <SkipNextIcon />
          </Button>
        </div>
        <div style={{ display: 'inline-block', margin: '1rem 1rem 1rem 0'}}>
          <div style={{ width: '15rem', display: 'flex', justfyContent: 'center', alignItems: 'center', margin: '0rem'}}>
            <VolumeDown />
            <Slider style={{ color: '#11A797', margin: '0 0.5rem'}} aria-label="Volume" value={volumeValue} onChange={handleVolumeChange} />
            <VolumeUp />
          </div>
        </div>
          {/* <img id="resume-button" className="audio-button" src="../assets/icons8-play-100.png" onClick={handleResume} /> */}
          {/* <img id="pause-button" className="audio-button" src="../assets/icons8-pause-100.png" onClick={handlePause} /> */}
      </div>
    </div>
  )
};

export default Player;