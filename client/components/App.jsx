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

// import React, { Component } from 'react'
// import { createGlobalStyle } from 'styled-components';
// import FileReaderInput from 'react-file-reader-input';
// import { ReactReader } from './custom-react-reader/modules';
// // import { ReactReader } from 'react-reader';

// import {
//   Container,
//   ReaderContainer,
//   Bar,
//   LogoWrapper,
//   Logo,
//   GenericButton,
//   CloseIcon,
//   FontSizeButton,
//   ButtonWrapper
// } from './custom-react-reader/Components'

// const storage = global.localStorage || null

// const DEMO_URL = 'https://blueocean.s3.us-west-1.amazonaws.com/accessible_epub_3+(1).epub'
// const DEMO_NAME = 'S3 BUCKET DEMO'

// const GlobalStyle = createGlobalStyle`
//   * {
//     font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
//     margin: 0;
//     padding: 0;
//     color: inherit;
//     font-size: inherit;
//     font-weight: 300;
//     line-height: 1.4;
//     word-break: break-word;
//   }
//   html {
//     font-size: 62.5%;
//   }
//   body {
//     margin: 0;
//     padding: 0;
//     min-height: 100vh;
//     font-size: 1.8rem;
//     background: #333;
//     position: absolute;
//     height: 100%;
//     width: 100%;
//     color: #fff;
//   }
// `

// class App extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       fullscreen: false,
//       location:
//         storage && storage.getItem('epub-location')
//           ? storage.getItem('epub-location')
//           : 2,
//       localFile: null,
//       localName: null,
//       largeText: false
//     }
//     this.rendition = null
//   }

//   toggleFullscreen = () => {
//     this.setState(
//       {
//         fullscreen: !this.state.fullscreen
//       },
//       () => {
//         setTimeout(() => {
//           const evt = document.createEvent('UIEvents')
//           evt.initUIEvent('resize', true, false, global, 0)
//         }, 1000)
//       }
//     )
//   }

//   onLocationChanged = location => {
//     this.setState(
//       {
//         location
//       },
//       () => {
//         storage && storage.setItem('epub-location', location)
//       }
//     )
//   }

//   onToggleFontSize = () => {
//     const nextState = !this.state.largeText
//     this.setState(
//       {
//         largeText: nextState
//       },
//       () => {
//         this.rendition.themes.fontSize(nextState ? '140%' : '100%')
//       }
//     )
//   }

//   getRendition = rendition => {
//     console.log('getRendition callback', rendition)
//     // Set inital font-size, and add a pointer to rendition for later updates
//     const { largeText } = this.state
//     this.rendition = rendition
//     rendition.themes.fontSize(largeText ? '140%' : '100%')
//   }
//   handleChangeFile = (event, results) => {
//     if (results.length > 0) {
//       const [e, file] = results[0]
//       if (file.type !== 'application/epub+zip') {
//         return alert('Unsupported type')
//       }
//       this.setState({
//         localFile: e.target.result,
//         localName: file.name,
//         location: null
//       })
//     }
//   }
//   render() {
//     const { fullscreen, location, localFile, localName } = this.state
//     return (
//       <Container>
//         <GlobalStyle />
//         <Bar>
//           <LogoWrapper href="https://github.com/gerhardsletten/react-reader">
//             <Logo
//               src="https://gerhardsletten.github.io/react-reader/files/react-reader.svg"
//               alt="React-reader - powered by epubjs"
//             />
//           </LogoWrapper>
//           <ButtonWrapper>
//             <FileReaderInput as="buffer" onChange={this.handleChangeFile}>
//               <GenericButton>Upload local epub</GenericButton>
//             </FileReaderInput>
//             <GenericButton onClick={this.toggleFullscreen}>
//               Use full browser window
//               <CloseIcon />
//             </GenericButton>
//           </ButtonWrapper>
//         </Bar>
//         <ReaderContainer fullscreen={fullscreen}>
//           <ReactReader
//             url={localFile || DEMO_URL}
//             title={localName || DEMO_NAME}
//             location={location}
//             locationChanged={this.onLocationChanged}
//             getRendition={this.getRendition}
//           />
//           <FontSizeButton onClick={this.onToggleFontSize}>
//             Toggle font-size
//           </FontSizeButton>
//         </ReaderContainer>
//       </Container>
//     )
//   }
// }

// export default App

import React, { useRef, useState, useEffect } from "react";
import { ReactReader } from "react-reader";
import axios from 'axios';
import Epub from 'epubjs/lib/index';

// Books
const accessible = "https://blueocean.s3.us-west-1.amazonaws.com/accessible_epub_3+(1).epub";
const moby = "https://s3.amazonaws.com/moby-dick/OPS/package.opf";
const alice = "https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf";

const bookTest = new Epub(moby)
console.log('epub', bookTest);
// console.log('BOOKTEST', bookTest.locations.cfiFromLocation());

let textIndex = 0;
let audio1 = document.getElementById('audio1')
let audio2 = document.getElementById('audio2')

console.log(responsiveVoice.enableEstimationTimeout);
responsiveVoice.enableEstimationTimeout = false;
console.log(responsiveVoice.enableEstimationTimeout);

const App = () => {
  const [page, setPage] = useState('')
  const [location, setLocation] = useState(null)
  const [selections, setSelections] = useState([])

  const renditionRef = useRef(null)
  const tocRef = useRef(null)


  const handlePause = (e) => {
    e.preventDefault();
    responsiveVoice.pause();
    console.log('clicked to pause');
  }

  const handleResume = (e) => {
    e.preventDefault();
    responsiveVoice.resume();
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
        var pageFlip = document.getElementById('page-flip');
        pageFlip.play();
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
      // console.log('locationEndCfi', locationEndCfi)
      // const locationTest = new Locations(renditionRef.current.book.spine)
      // console.log('locationTest', locationTest)
      /**************************************************************************************************************
      NOTE: Need to use a function to find the greatest common base string between the two start/end rage cfi's for the "breakpoint"
      ***************************************************************************************************************/
      const breakpoint = locationStartCfi.indexOf(']!') + 6;
      const base = locationStartCfi.substring(0, breakpoint);
      const startRange = locationStartCfi.substring(breakpoint, locationStartCfi.length - 1);
      const endRange = locationEndCfi.substring(breakpoint, locationEndCfi.length);
      const cfiRange = `${base},${startRange},${endRange}`;

      // console.log('cfiRange', cfiRange, startRange, endRange)

      // console.log('base', base);
      // console.log('startRange', startRange);
      // console.log('endRange', endRange);
      // console.log('cfiRange', cfiRange);

      const createAudio = (line) => {
        return axios.post('/audio', {data: line})
          .catch((err) => console.log(err));
      }

      audio1.addEventListener('ended', () => {
        let audio2 = document.getElementById(`audio2`)
        audio2.play();
      });

      audio2.addEventListener('ended', () => {
        let audio1 = document.getElementById(`audio1`)
        audio1.play();
      });

      renditionRef.current.book.getRange(cfiRange).then(function (range) {
        console.log('renditionRef', renditionRef, 'range', range);
        let text = range.toString()
        text = text.split('\n');
        text = text.map((line) => line.trim());
        text = text.filter((line) => {
          return line !== '' ? true : false
        });
        console.log('text', text);
        createAudio(text[textIndex])
          .then(() => {
            textIndex++;
            document.getElementById(`audio1`).play();
          })
          .catch((error) => {
            console.log(error)
          })

        audio1.addEventListener('playing', () => {
          console.log('detected audio1 playing')
          if (textIndex > text.length - 1) return;
          createAudio(text[textIndex])
            .then(() => textIndex++)
            .catch((error) => {
              console.log(error)
            })
        });

        audio2.addEventListener('playing', () => {
          console.log('detected audio2 playing')
          if (textIndex > text.length - 1) return;
          createAudio(text[textIndex])
            .then(() => textIndex++)
            .catch((error) => {
              console.log(error)
            })
        });
      })
        // console.log(text === "\n  ")
        // if (text && text.length > 0 && text !== "\n  ") {
        //   responsiveVoice.speak(text, "UK English Female", parameters);
        // }
      // }).catch((err) => {
      //   console.error(err);
      // })
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
