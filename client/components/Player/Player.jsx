import React, { useRef, useState, useEffect, useContext } from "react";
import { ReactReader } from "react-reader";
import Controls from "./Controls.jsx";
import axios from 'axios';
// import Modal from './Modal.jsx';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { GlobalContext } from "../GlobalContextProvider";
import Button from '@mui/material/Button';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import { useHistory } from 'react-router-dom';


// Books
const accessible = "https://blueocean.s3.us-west-1.amazonaws.com/accessible_epub_3+(1).epub";
const moby = "https://s3.amazonaws.com/moby-dick/OPS/package.opf";
const alice = "https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf";
const music = ['fire', 'hulk', 'animal'];

console.log(responsiveVoice.getVoices());

console.log(responsiveVoice.enableEstimationTimeout);
responsiveVoice.enableEstimationTimeout = false;
console.log(responsiveVoice.enableEstimationTimeout);

console.log(responsiveVoice);
responsiveVoice.enableWindowClickHook();

const Player = (props) => {
  const [page, setPage] = useState('');
  // let currentCFI;
  // if (props.book.CFI !== '') {
  //   currentCFI = props.book.CFI;
  // } else {
  //   currentCFI = null;
  // }
  const [location, setLocation] = useState(null);
  const [selections, setSelections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const voiceOptions = responsiveVoice.getVoices();
  const [voice, setVoice] = useState(voiceOptions[0].name);
  const [backgroundV, setBackgroundV] = useState(0);
  const [voiceBackgroundV, setVoiceBackgroundV] = useState(0);
  const [firstPage, setFirstPage] = useState(true);
  const [selectedSong, setSelectedSong] = useState('fire');
  const backgroundS = document.getElementById('fire');

  const { value, setValue } = useContext(GlobalContext);

  // useEffect(() => {
  //   backgroundS.pause();
  //   backgroundS.load();
  // }, [selectedSong]);

  //Voice Command
  let voiceCommandError = '';
  const commands = [
    {
      command: ['Text *'],
      callback: (input) => {
        if (fontSizeOptions.indexOf(Number(input)) !== -1) {
          setSize(Number(input));
        }
      }
    },
    {
      command: ['Open settings'],
      callback: () => {
        setShowModal(true);
        handlePause();
      }
    },
    {
      command: ['Volume *'],
      callback: (input) => {
        // TO DO: Volume 10 & below, need to convert to number
        handlePause();
        setVoiceParameters({
          onstart: voiceParameters.onstart,
          onend: voiceParameters.onend,
          volume: Number(input)/100,
          rate: voiceParameters.rate,
          pitch: voiceParameters.pitch,
        });
      }
    },
    {
      command: ['Speed *'],
      callback: (input) => {
        handlePause();
        setVoiceParameters({
          onstart: voiceParameters.onstart,
          onend: voiceParameters.onend,
          volume: voiceParameters.volume,
          rate: Number(input)/100,
          pitch: voiceParameters.pitch,
        });
      }
    },
    {
      command: ['Pitch *'],
      callback: (input) => {
        handlePause();
        setVoiceParameters({
          onstart: voiceParameters.onstart,
          onend: voiceParameters.onend,
          volume: voiceParameters.volume,
          rate: voiceParameters.rate,
          pitch: Number(input)/100,
        });
      }
    },
    {
      command: ['Background Music *'],
      callback: (input) => {
        handlePause();
        setVoiceBackgroundV(Number(input)/100);
      }
    }
  ];

  const { transcript } = useSpeechRecognition({ commands });
  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  };

  const [voiceParameters, setVoiceParameters] = useState({
    onstart: voiceStartCallback,
    onend: voiceEndCallback,
    volume: 0.5,
    pitch: 1,
    rate: 1
  });

  useEffect(() => {
    if (!isPlaying) {
      responsiveVoice.clickEvent();
      responsiveVoice.speak(remainingText.current, voice, voiceParameters);
      setPlaying(true);
      backgroundS.play();
    }
  }, [voiceParameters])

  useEffect(() => {
    if (voiceBackgroundV === 0) {
      backgroundS.pause();
    } else {
      backgroundS.play();
      backgroundS.volume = voiceBackgroundV;
    }
    handleResume();
  }, [voiceBackgroundV]);
  // const currentRenditionText = useRef('');
  // const remainingRenditionText = useRef('');


  /**************************************************************************************************************
  NOTE: We need to keep track of a 'playing' state/ref which gets updated when whenever we click on the pause/resume buttons.
  When speech is playing, we don't want to be able to hit the resume button again (otherwise it'll re-start the speech).
  ***************************************************************************************************************/
  const [isPlaying, setPlaying] = useState(false);
  // const [volume, setVolume] = useState(.1);
  // const volumeRef = useRef(0.1);
  const [size, setSize] = useState(100);
  const [parameters, setParameters] = useState({
    onstart: voiceStartCallback,
    onend: voiceEndCallback,
    volume: 0.5,
    pitch: 1,
    rate: 1
  });

  const responsiveVoiceTextArray = useRef([]);
  const responsiveVoiceCurrentMsgIndex = useRef(null);
  const remainingText = useRef('');

  const renditionRef = useRef(null)
  const tocRef = useRef(null)

  const rangeRef = useRef(null)
  const _cfiRangeRef = useRef(null)
  const highlightedRef = useRef(false)
  const rangeRefValidChildrenRef = useRef(null)

  props.highlightBookRef.current = props.book.link;

  // Text highlighting loop
  function loop() {
    if (props.highlightBookRef.current === "https://blueocean.s3.us-west-1.amazonaws.com/The Man Who Died Twice by Richard Osman.epub"
      || props.highlightBookRef.current === "https://blueocean.s3.us-west-1.amazonaws.com/The Assassin_s Legacy by D. Lieber.epub") {
        console.log('props.book.link', props.book.link)
        console.log('props.highlightBookRef.current', props.highlightBookRef.current)
        if (responsiveVoice) {
        if (responsiveVoice.currentMsg) {
          // Put additional contraint that text must be over 5 letters long
          if (responsiveVoice.currentMsg.text && responsiveVoice.currentMsg.text.trim().length > 5) {
            let responsiveVoiceCurrentMsgText = responsiveVoice.currentMsg.text.trim();
            // Remove quote if there's a quote as 1st character, then trim
            if (responsiveVoiceCurrentMsgText[0] === "'" || responsiveVoiceCurrentMsgText[0] === '"') {
              responsiveVoiceCurrentMsgText = responsiveVoiceCurrentMsgText.substring(1);
              responsiveVoiceCurrentMsgText = responsiveVoiceCurrentMsgText.trim();
            }
            // Remove punctuation from the end if there's punctuation, then trim
            if (responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === ","
              || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === "."
              || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === ";"
              || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === "!"
              || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === "?"
              || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === "'"
              || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === '"'
              ) {
              responsiveVoiceCurrentMsgText = responsiveVoiceCurrentMsgText.substring(0, responsiveVoiceCurrentMsgText.length);
              responsiveVoiceCurrentMsgText = responsiveVoiceCurrentMsgText.trim();
              if (responsiveVoiceCurrentMsgText.length > 0) { responsiveVoiceCurrentMsgText = responsiveVoiceCurrentMsgText.substring(1) };
            }

            if (rangeRef.current && renditionRef.current) {
              if (renditionRef.current.location) {
                // Ignore the cover page
                if (!renditionRef.current.location.atStart) {
                  // Make sure querySelectorAll function exists for the ref
                  // console.log('rangeRefValidChildren', rangeRefValidChildrenRef.current)
                  if (rangeRefValidChildrenRef.current && rangeRefValidChildrenRef.current.length > 0) {
                    rangeRefValidChildrenRef.current.forEach((child, index) => {
                      if (child) {
                        if (child.innerHTML.indexOf(responsiveVoiceCurrentMsgText) !== -1) {
                          // console.log('inner text of child element (child.innerText)', child.innerText)
                          // console.log('current message text', responsiveVoiceCurrentMsgText)
                          var foundChild = child;
                          var foundChildNext = rangeRefValidChildrenRef.current[index + 1]

                          // console.log('foundChild', foundChild)
                          // console.log('foundChild.childNodes', foundChild.childNodes)

                          var foundChildNodeArray = Array.prototype.slice.call(foundChild.childNodes);
                          // console.log('foundChildNodeArray.indexOf(foundChildNext)', foundChildNodeArray.indexOf(foundChildNext));
                          // console.log('foundChildNext', foundChildNext)

                          if (foundChildNodeArray.indexOf(foundChildNext) !== -1) {
                            foundChildNext = rangeRefValidChildrenRef.current[index + 2]
                          }

                          // if (foundChildNext) { console.log('foundChildNext.outerHTML', foundChildNext.outerHTML) }
                          var renditionRefContents = renditionRef.current.getContents();
                          var foundChildCFI = renditionRefContents[0].cfiFromNode(foundChild)
                          var foundChildNextCFI = foundChildNext ? renditionRefContents[0].cfiFromNode(foundChildNext) : renditionRef.current.location.end.cfi;
                          // console.log('renditionRef.current.location', renditionRef.current.location)
                          // console.log('--------------------------------------------------------------------------------------------------------------------------------------------renditionRefContents[0].cfiFromNode(child)', foundChildNextCFI)

                          const _breakpoint = foundChildCFI.indexOf('!') + 1;
                          const _base = foundChildCFI.substring(0, _breakpoint);
                          const _startRange = foundChildCFI.substring(_breakpoint, foundChildCFI.length - 1);
                          const _endRange = foundChildNextCFI.substring(_breakpoint, foundChildNextCFI.length);
                          const _cfiRange = `${_base},${_startRange},${_endRange}`;

                          // console.log('_base', _base);
                          // console.log('_startRange', _startRange);
                          // console.log('_endRange', _endRange);
                          // console.log('_cfiRange', _cfiRange);
                          // console.log('renditionRef.current', renditionRef.current);

                          renditionRef.current.book.getRange(_cfiRange).then(function (range) {
                            if (_cfiRange !== _cfiRangeRef.current) {
                              renditionRef.current.annotations.remove(_cfiRangeRef.current, 'highlight');
                              _cfiRangeRef.current = _cfiRange;
                              // console.log(_cfiRangeRef.current)
                              highlightedRef.current = false;
                              // console.log('responsiveVoice.currentMsg.text.trim()', responsiveVoice.currentMsg.text.trim())
                            }
                            if (highlightedRef.current !== null && highlightedRef.current !== undefined) {
                              if (!highlightedRef.current) {
                                renditionRef.current.annotations.add("highlight", _cfiRangeRef.current, {}, null, "hl", { "fill": "yellow", "fill-opacity": "0.5", "mix-blend-mode": "color" })
                              }
                            }
                            highlightedRef.current = true;
                          })
                            .catch((error) => {
                              // console.log(error)
                            }
                            );
                        }


                      }
                    })
                  }
                }
              }
            }
          }
        }
      }
    }

    setTimeout(function () {
      loop()
    }, 1000);

    // timeoutID = setTimeout(function () {
    //   loop()
    // }, 1000);

    // const intervalLoop = setInterval(loop, 1000);
  };

  if (props.highlightBookRef.current === "https://blueocean.s3.us-west-1.amazonaws.com/The Man Who Died Twice by Richard Osman.epub"
    || props.highlightBookRef.current === "https://blueocean.s3.us-west-1.amazonaws.com/The Assassin_s Legacy by D. Lieber.epub") {
    loop();
  }

  // Callback stuff
  function voiceStartCallback() {
    console.log("Voice started");
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', responsiveVoice)
    // handlePause();
    // handleResume();
  }

  // page flip doesn't work anymore :(
  function voiceEndCallback() {
    console.log('~~', remainingText, renditionRef.current)
    console.log(renditionRef.current.location, 'in onend')
    if (renditionRef.current.location.atEnd) {
      console.log(renditionRef.current.location.atEnd, 'in onend')
      axios.put('/account/bookmark', {
        email: value,
        id: props.book['_id'],
        cfi: '',
        remainingText: '',
      })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      console.log("Voice ended", responsiveVoice);
      var audio = document.getElementById('audio');
      if (window.SpeechSynthesisUtterance.text !== '') {
        audio.play();
        setTimeout(() => {
          if (renditionRef.current) {
            renditionRef.current.next()
          }
        }, 400);
      }
    }
  }

  const handlePause = () => {
    if (isPlaying) {
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
      //Send cfi
      // console.log(value);
      if (!renditionRef.current.location.atEnd) {
        axios.put('/account/bookmark', {
          email: value,
          id: props.book['_id'],
          cfi: `${location}`,
          remainingText: remainingText.current,
        })
          .then(response => {
            console.log(response);
          })
          .catch(err => {
            console.log(err);
          })
      }
    }
  }

  const handleResume = () => {
    if (!isPlaying) {
      responsiveVoice.clickEvent();
      responsiveVoice.speak(remainingText.current, voice, parameters);
      setPlaying(true);
    }
  }

  const locationChanged = (epubcfi) => {
    responsiveVoice.cancel();
    if (renditionRef.current && tocRef.current) {
      const { displayed, href } = renditionRef.current.location.start
      const chapter = tocRef.current.find((item) => item.href === href)
      setPage(`Page ${displayed.page} of ${displayed.total} in chapter ${chapter ? chapter.label : 'n/a'}`)
      if (firstPage && props.book.cfi && props.book.cfi.indexOf('\n') !== -1 && props.book.cfi !== 'null') {
        setFirstPage(false);
        console.log('+=====================================================================', props.book.cfi)
        setLocation(props.book.cfi.substring(0, props.book.cfi.length - 2));

      } else if (firstPage && props.book.cfi && props.book.cfi.indexOf('\n') === -1 && props.book.cfi !== 'null') {
        setFirstPage(false);
        setLocation(props.book.cfi);
      } else {
        // const thisBugMustDie = 'epubcfi(/6/6[item6]!,/4/2[pgepubid00003]/4[link2H_INTR]/10/1:808,/4/2[pgepubid00003]/4[link2H_INTR]/14/1:1218)';
        // const thisBugMustDie = 'epubcfi(/6/4[item5]!/4/2/1:0)';
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~', epubcfi);
        // data: "{\"email\":\"jb@jb.com\",\"id\":\"6171b97cc84e7d1b07d37ad2\",\"cfi\":\"epubcfi(/6/4[item5]!/4/2/1:0)\",\"remainingText\":\"INTRODUCTION AND ANALYSIS.\"}"

        setLocation(epubcfi)
      }
      // console.log('----------------------------------------------------------------------------------------', epubcfi)
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
      const breakpoint = locationStartCfi.indexOf('!') + 1;
      const base = locationStartCfi.substring(0, breakpoint);
      const startRange = locationStartCfi.substring(breakpoint, locationStartCfi.length - 1);
      const endRange = locationEndCfi.substring(breakpoint, locationEndCfi.length);
      const cfiRange = `${base},${startRange},${endRange}`;



      // console.log('base', base);
      // console.log('startRange', startRange);
      // console.log('endRange', endRange);
      console.log('cfiRange', cfiRange);

      renditionRef.current.book.getRange(cfiRange).then(function (range) {
        console.log('range', range);
        let text = range.toString().trim()
        remainingText.current = props.book.remainingText || text;
        console.log('text', text);
        // console.log(text === "\n  ")
        axios.put('/account/bookmark', {
          email: value,
          id: props.book['_id'],
          cfi: epubcfi,
          remainingText: remainingText.current,
        })
          .then(response => {
            console.log(response);
          })
          .catch(err => {
            console.log(err);
          })

          if (props.highlightBookRef.current === "https://blueocean.s3.us-west-1.amazonaws.com/The Man Who Died Twice by Richard Osman.epub"
          || props.highlightBookRef.current === "https://blueocean.s3.us-west-1.amazonaws.com/The Assassin_s Legacy by D. Lieber.epub") {
          rangeRef.current = range.commonAncestorContainer;

          if (rangeRef.current && renditionRef.current) {
            if (renditionRef.current.location) {
              console.log('renditionRef.current.location.atStart', renditionRef.current.location.atStart)
              // Ignore the cover page
              if (!renditionRef.current.location.atStart) {
                // Make sure querySelectorAll function exists for the ref
                if (rangeRef.current.querySelectorAll) {
                  var rangeRefCurrentChildren = rangeRef.current.querySelectorAll("*");
                  var rangeRefValidChildren = [];
                  // console.log('rangeRefCurrentChildren', rangeRefCurrentChildren[0])
                  rangeRefCurrentChildren.forEach((child, index) => {
                    if (child) {
                      // Only push valid children to our array
                      // Inner text must exist; this is to filter out nodes with only other child nodes but no text.
                      if (child.innerText.length > 0) {
                        // Remove italic, emphasized, bold, break tags; prevent "nextChild" from being a styled subset of "currentChild".
                        if (
                          child.outerHTML.substring(0, 3) !== '<i>'
                          && child.outerHTML.substring(0, 3) !== '<b>'
                          && child.outerHTML.substring(0, 3) !== '<br'
                          && child.outerHTML.substring(0, 3) !== '<em') {
                          rangeRefValidChildren.push(child)
                        }
                      }
                      if (rangeRefValidChildren && rangeRefValidChildren.length > 0) {
                        rangeRefValidChildrenRef.current = rangeRefValidChildren;
                      }
                    }
                  })
                }
              }
            }
          }
        }

        console.log('on render', remainingText.current && remainingText.current.length > 0 && remainingText.current !== "\n")
        if (remainingText.current && remainingText.current.length > 0 && remainingText.current !== "\n") {
          // currentRenditionText.current = text;
          responsiveVoice.speak(remainingText.current, voice, parameters);
          props.book.remainingText = '';
          setPlaying(true);
          // console.log('did if fire')
        } else {
          // console.log('did else fire')
          // setTimeout(() => { renditionRef.current.next() }, 4269);
        }
      })
    }
  }

  const handleVolumeChange = (e) => {
    console.log('increase detected')
    e.preventDefault();
    const newVolume = e.target.value;
    setParameters({
      onstart: voiceStartCallback,
      onend: voiceEndCallback,
      volume: newVolume,
      rate: parameters.rate,
      pitch: parameters.pitch
    })
    console.log('old volume', parameters.volume);
    handlePause();
  }


  backgroundS.onended = function () {
    backgroundS.play()
  };

  useEffect(() => {
    backgroundS.play();
    backgroundS.volume = backgroundV;
  }, []);

  useEffect(() => {
    if (!showModal) {
      if (responsiveVoice.multipartText && responsiveVoice.currentMsg) {
        if (backgroundV === 0) {
          backgroundS.pause();
        } else {
          backgroundS.play();
          backgroundS.volume = backgroundV;
        }
        console.log('new volume', parameters.volume);
        remainingText.current = responsiveVoiceTextArray.current.slice(responsiveVoiceCurrentMsgIndex.current).join('');
        console.log('jsdflksjklfjhsalfhlhjsaflhsafsakfjhksalfhlsahjsahfljkhjflkshfjlshafjklsfklhsjakflhsjhflkhslka', remainingText.current)
        if (remainingText.current !== '') {
          handleResume();
        }
      }
    }
  }, [showModal]);

  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${size}%`)
      handleResume();
    }
  }, [size])

  // useEffect(() => {
  //   if (renditionRef.current) {
  //     function setRenderSelection(cfiRange, contents) {
  //       console.log('cfiRange', cfiRange)
  //       console.log('contents', contents)
  //       setSelections(selections.concat({
  //         text: renditionRef.current.getRange(cfiRange).toString(),
  //         cfiRange
  //       }))
  //       // renditionRef.current.annotations.add("highlight", cfiRange, {}, null, "hl", { "fill": "red", "fill-opacity": "0.5", "mix-blend-mode": "multiply" })
  //       renditionRef.current.annotations.add("highlight", cfiRange, {}, null, "hl", { "fill": "red", "fill-opacity": "0.5" })
  //       contents.window.getSelection().removeAllRanges()
  //     }
  //     renditionRef.current.on("selected", setRenderSelection)

  //     return () => {
  //       renditionRef.current.off("selected", setRenderSelection)
  //     }
  //   }
  // }, [setSelections, selections])

  // go back button
  const history = useHistory();

  const handleBackToAccount = () => {
    handlePause();
    backgroundS.pause();
    history.push('/home');
  };

  return (
    <div>
      <div style={{ zIndex: 20, position: 'absolute', top: '0%', left: '0%', width: '100%', height: "80vh" }}>
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
            renditionRef.current.themes.fontSize(`${size}%`)
            setSelections([])
          }}
          tocChanged={toc => tocRef.current = toc}
        />
      </div>
      <div style={{ height: '20vh', position: 'absolute', top: '80%', left: '0%', width: '100%', zIndex: 20 }}>
        <Controls isPlaying={isPlaying} showModal={showModal} setShowModal={setShowModal} handleResume={handleResume} handlePause={handlePause} handleVolumeChange={handleVolumeChange} setSize={setSize} parameters={parameters} setParameters={setParameters} page={page} book={props.book} voiceOptions={voiceOptions} voice={voice} setVoice={setVoice} backgroundV={backgroundV} setBackgroundV={setBackgroundV} selectedSong={selectedSong} setSelectedSong={setSelectedSong} music={music} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            variant='contained'
            size='small'
            style={{ backgroundColor: '#11A797' }}
            type='button'
            onClick={() => {
              handlePause();
              backgroundS.pause();
              SpeechRecognition.startListening();
            }}
          >
            <SettingsVoiceIcon />
          </Button>
          <p id="transcript">Transcript: {transcript}</p>
        </div>
      </div>
      <Button
        style={{ backgroundColor: '#0c6057', position: 'absolute', top: '2%', left: '40vw', zIndex: 30, fontSize: '70%', padding: '0.5vw 2vw' }}
        variant='contained'
        type='button'
        onClick={handleBackToAccount}
      >
        Back to Account
      </Button>
    </div>
  )
};

const fontSizeOptions = [25, 50, 100, 125, 150, 175, 200];

export default Player;