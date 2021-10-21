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

import React, { useRef, useState, useEffect, useMemo } from "react"
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

  /**************************************************************************************************************
  NOTE: We need to keep track of a 'playing' state/ref which gets updated when whenever we click on the pause/resume buttons.
  When speech is playing, we don't want to be able to hit the resume button again (otherwise it'll re-start the speech).
  ***************************************************************************************************************/
  const [isPlaying, setPlaying] = useState(false);
  const responsiveVoiceTextArray = useRef([]);
  const responsiveVoiceCurrentMsgIndex = useRef(null);
  const remainingText = useRef('');

  const renditionRef = useRef(null)
  const tocRef = useRef(null)
  const rangeRef = useRef('')
  const _cfiRangeRef = useRef(null)
  const highlightedRef = useRef(false)



  //   setInterval(function(){
  //     //this code runs every second
  //     console.log('does this work')
  // }, 1000);

  function loop() {
    // console.log('does this work')
    if (responsiveVoice) {
      if (responsiveVoice.currentMsg) {
        // console.log('current message', responsiveVoice.currentMsg)
        // if (responsiveVoice.currentMsg.text) {
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
            || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === "?") {
            responsiveVoiceCurrentMsgText = responsiveVoiceCurrentMsgText.substring(0, responsiveVoiceCurrentMsgText.length);
            responsiveVoiceCurrentMsgText = responsiveVoiceCurrentMsgText.trim();
          }

          // console.log('current message text', responsiveVoiceCurrentMsgText)
          // console.log('rangeRef.current', rangeRef.current)
          if (rangeRef.current) {
            // console.log('rangeRef.current, based on commonAncestorContainer', rangeRef.current)
            // console.log('rangeRef.current all children', rangeRef.current.querySelectorAll("*"));
            // console.log('rangeRef.current.childNodes', rangeRef.current.childNodes)

            var rangeRefCurrentChildren = rangeRef.current.querySelectorAll("*");
            var rangeRefValidChildren = [];
            // console.log('rangeRefCurrentChildren', rangeRefCurrentChildren)
            rangeRefCurrentChildren.forEach((child, index) => {
              if (child) {
                // console.log(child, index);
                // console.log('child.length', child.length);

                // console.log('child.value', child.value);
                // console.log('child.nodeValue', child.nodeValue);
                // console.log('child.innerHTML', child.innerHTML, index);
                // console.log('child.innerText', child.innerText, index);

                // // Only push valid children to our array
                // console.log('--------------------------------------------------------child.childNodes', child.childNodes, index)
                // if (child.innerHTML.indexOf("<") === -1 && child.innerHTML.indexOf(">") === -1) {
                //   rangeRefValidChildren.push(child)
                // }

                // Only push valid children to our array
                // Inner text must exist; this is to filter out nodes with only other child nodes but no text.
                if (child.innerText.length > 0) {
                  // console.log(child.innerHTML, index)
                  // // Remove italic, emphasized, bold tags; prevent "nextChild" from being a styled subset of "currentChild".
                  // if (child.outerHTML.substring(0, 2) !== '<i' && child.outerHTML.substring(0, 3) !== '<br') {
                  //   rangeRefValidChildren.push(child)
                  // }
                  // Instead of removing italic, emphasized, bold tags; add only <p> and <header> tags
                  if (child.outerHTML.substring(0, 2) === '<p' || child.outerHTML.substring(0, 2) === '<h') {
                    rangeRefValidChildren.push(child)
                  }
                }
              }
            })
            // console.log('rangeRefValidChildren', rangeRefValidChildren)
            rangeRefValidChildren.forEach((child, index) => {
              // rangeRefCurrentChildren.forEach((child, index) => {
              if (child) {
                // console.log(child, index);
                // console.log('child.length', child.length);

                // console.log('child.value', child.value);
                // console.log('child.nodeValue', child.nodeValue);
                // console.log('child.innerHTML', child.innerHTML);
                // if (child.innerHTML.indexOf("is") !== -1) {
                // if (child.innerHTML.indexOf(responsiveVoiceCurrentMsgText) !== -1) {
                if (child.innerHTML.indexOf(responsiveVoiceCurrentMsgText) !== -1) {
                  // alert(child.innerHTML)
                  // console.log(child.innerHTML)
                  console.log('inner text of child element (child.innerText)', child.innerText)
                  console.log('current message text', responsiveVoiceCurrentMsgText)
                  var foundChild = child;
                  var foundChildNext = rangeRefValidChildren[index + 1]
                  console.log('foundChild', foundChild)
                  console.log('foundChildNext', foundChildNext)
                  console.log('foundChildNext.outerHTML', foundChildNext.outerHTML)
                  // console.log('foundChild.innerHTML', foundChild.innerHTML)
                  // if (foundChildNext) { console.log('foundChildNext.innerHTML', foundChildNext.innerHTML) }
                  // var selectedChildRange = renditionRef.current.book.spine.spineItems[4].cfiFromElement(child);
                  // console.log('renditionRef.current.book.spine.spineItems[4].cfiFromElement(child)', selectedChildRange)
                  var renditionRefContents = renditionRef.current.getContents();
                  var foundChildCFI = renditionRefContents[0].cfiFromNode(foundChild)
                  var foundChildNextCFI = foundChildNext ? renditionRefContents[0].cfiFromNode(foundChildNext) : renditionRef.current.location.end.cfi;
                  // console.log('--------------------------------------------------------------------------------------------------------------------------------------------renditionRefContents', renditionRefContents)
                  // console.log('--------------------------------------------------------------------------------------------------------------------------------------------renditionRefContents[0].cfiFromNode(child)', foundChildCFI)
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

                  // console.log(_cfiRange !== _cfiRangeRef.current)
                  if (_cfiRange !== _cfiRangeRef.current) {
                    renditionRef.current.annotations.remove(_cfiRangeRef.current, 'highlight');
                    _cfiRangeRef.current = _cfiRange;
                    console.log(_cfiRangeRef.current)
                    highlightedRef.current = false;
                    console.log('responsiveVoice.currentMsg.text.trim()', responsiveVoice.currentMsg.text.trim())
                  }

                  // const memoizedAnnotation = useMemo( () => {renditionRef.current.annotations.add("highlight", _cfiRange, {}, null, "hl", { "fill": "red", "fill-opacity": "0.1", "mix-blend-mode": "difference" })})
                  if (highlightedRef.current !== null & highlightedRef !== undefined) {
                    if (!highlightedRef.current) {
                      renditionRef.current.annotations.add("highlight", _cfiRangeRef.current, {}, null, "hl", { "fill": "red", "fill-opacity": "0.1", "mix-blend-mode": "color" })
                    }
                  }
                  highlightedRef.current = true;

                }


              }
            })

            // console.log('renditionRef.current', renditionRef.current)

            // console.log('renditionRef.current.book', renditionRef.current.book)
            // console.log('renditionRef.current.book.spine.spineItems', renditionRef.current.book.spine.spineItems)
            // console.log('renditionRef.current.book.spine.spineItems[4]', renditionRef.current.book.spine.spineItems[4])
            // console.log('renditionRef.current.book.spine.spineItems[4].cfiFromElement', renditionRef.current.book.spine.spineItems[4].cfiFromElement)
            // console.log('renditionRef.current.book.spine.spineItems[4].contents', renditionRef.current.book.spine.spineItems[4].contents)

            // console.log(renditionRef.current.book.cfiFromElement)
          }
        }
      }
    }
    setTimeout(function () {
      // execute script
      loop()
    }, 1000); //9000 = 9000ms = 9s
  };

  loop();

  console.log('does this work')

  function longestBaseString(str1, str2) {
    let shorterString;
    let longerString;
    if (str1.length < str2.length) {
      shorterString = str1;
      longerString = str2;
    } else {
      shorterString = str2;
      longerString = str1;
    }

    const length = shorterString.length;
    let i = 0;
    while (i < length && str1.charAt(i) === str2.charAt(i)) {
      i++;
    }

    return str1.substring(0, i);
  }

  // Callback stuff
  function voiceStartCallback() {
    console.log("Voice started");
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

  var parameters = {
    onstart: voiceStartCallback,
    onend: voiceEndCallback,
    onpause: voicePauseCallback,
    onresume: voiceResumeCallback,
    volume: 0.8,
    rate: 2
  }

  const handlePause = (e) => {
    if (isPlaying) {
      e.preventDefault();
      console.log('current message', responsiveVoice.currentMsg)
      console.log('current message text', responsiveVoice.currentMsg.text)
      // remainingRenditionText.current = currentRenditionText.current.substring(currentRenditionText.current.indexOf(responsiveVoice.currentMsg.text))
      responsiveVoiceTextArray.current = responsiveVoice.multipartText;
      responsiveVoiceCurrentMsgIndex.current = responsiveVoice.currentMsg.rvIndex;
      remainingText.current = responsiveVoiceTextArray.current.slice(responsiveVoiceCurrentMsgIndex.current).join('');
      // responsiveVoice.pause();
      responsiveVoice.cancel();
      console.log('clicked to pause');
      // console.log('currentRenditionText ref', currentRenditionText.current);
      // console.log('index of current message text in currentRenditionText ref', currentRenditionText.current.indexOf(responsiveVoice.currentMsg.text))
      // console.log('remaining message text', currentRenditionText.current.substring(currentRenditionText.current.indexOf(responsiveVoice.currentMsg.text)))
      console.log('responsiveVoiceTextArray.current', responsiveVoiceTextArray.current);
      console.log('responsiveVoiceCurrentMsgIndex.current', responsiveVoiceCurrentMsgIndex.current);
      console.log('remainingText.current', remainingText.current);
      setPlaying(false);
    }
  }


  const handleResume = (e) => {
    if (!isPlaying) {
      responsiveVoice.clickEvent();
      e.preventDefault();
      // responsiveVoiceTextArray.current = responsiveVoice.multipartText;
      // responsiveVoiceCurrentMsgIndex.current = responsiveVoice.currentMsg.rvIndex;
      // const remainingText = responsiveVoiceTextArray.current.slice(responsiveVoiceCurrentMsgIndex.current).join('');
      // remainingText.current = responsiveVoiceTextArray.current.slice(responsiveVoiceCurrentMsgIndex.current).join('');
      // responsiveVoice.speak(remainingText, "UK English Female");
      responsiveVoice.speak(remainingText.current, "UK English Female", parameters);
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

      // const cfiBase = locationStartCfi.replace(/!.*/, '')
      // const cfiStart = locationStartCfi.replace(/.*!/, '').replace(/\)$/, '')
      // const cfiEnd = locationEndCfi.replace(/.*!/, '').replace(/\)$/, '')
      // const cfiRange = `${cfiBase}!,${cfiStart},${cfiEnd})`

      // console.log('cfiBase', cfiBase);
      // console.log('cfiStart', cfiStart);
      // console.log('cfiEnd', cfiEnd);
      // console.log('cfiRange', cfiRange);

      /**************************************************************************************************************
      NOTE: Need to use a function to find the greatest common base string between the two start/end rage cfi's for the "breakpoint"
      ***************************************************************************************************************/
      const breakpoint = locationStartCfi.indexOf('!') + 1;
      const base = locationStartCfi.substring(0, breakpoint);
      const startRange = locationStartCfi.substring(breakpoint, locationStartCfi.length - 1);
      const endRange = locationEndCfi.substring(breakpoint, locationEndCfi.length);
      const cfiRange = `${base},${startRange},${endRange}`;

      // const myBase = longestBaseString(locationStartCfi, locationEndCfi);
      // const myStartRange = locationStartCfi.substring(myBase.length, locationStartCfi.length - 1);
      // const myEndRange = locationEndCfi.substring(myBase.length, locationEndCfi.length);
      // const myCfiRange = `${myBase},${myStartRange},${myEndRange}`;
      // console.log('myBase', myBase)
      // console.log('myStartRange', myStartRange);
      // console.log('myEndRange', myEndRange);
      // console.log('myCfiRange', myCfiRange);

      console.log('base', base);
      console.log('startRange', startRange);
      console.log('endRange', endRange);
      console.log('cfiRange', cfiRange);

      // if (renditionRef.current) {console.log(renditionRef.current.book)}
      console.log('renditionRef.current', renditionRef.current)
      if (renditionRef.current.location.atEnd) {
        alert("you're at the end")
      }
      // if (currentSection === renditionRef.current.book.spine.spineItems[renditionRef.current.book.spine.spineItems.length - 1]) {
      //   if page is double view,
      //     check if current page is 1 less than last page
      //   if page is single view,
      //     check if current page is equal to last page
      //     alert('on last page')
      // }

      renditionRef.current.book.getRange(cfiRange).then(function (range) {
        rangeRef.current = range.commonAncestorContainer;
        // console.log('rangeRef.current, based on commonAncestorContainer', rangeRef.current)
        // console.log('rangeRef.current all children', rangeRef.current.querySelectorAll("*"));
        // // console.log(rangeRef.current.childNodes)

        // var rangeRefCurrentChildren = rangeRef.current.querySelectorAll("*");
        // var rangeRefValidChildren = [];
        // rangeRefCurrentChildren.forEach((child, index) => {
        //   console.log(child, index);
        //   // console.log('child.length', child.length);

        //   // console.log('child.value', child.value);
        //   // console.log('child.nodeValue', child.nodeValue);
        //   console.log('child.innerHTML', child.innerHTML);
        //   if (child.innerHTML.indexOf("<") === -1 && child.innerHTML.indexOf(">") === -1) {
        //     rangeRefValidChildren.push(child)
        //   }
        // })
        // console.log('rangeRefValidChildren', rangeRefValidChildren)
        // rangeRefValidChildren.forEach((child, index) => {
        //   console.log(child, index);
        //   // console.log('child.length', child.length);

        //   // console.log('child.value', child.value);
        //   // console.log('child.nodeValue', child.nodeValue);
        //   console.log('child.innerHTML', child.innerHTML);
        //   if (child.innerHTML.indexOf("difficult") !== -1) {
        //     alert(child.innerHTML)
        //   }
        // })

        // console.log('renditionRef.current', renditionRef.current)

        // console.log('renditionRef.current.book', renditionRef.current.book)
        // console.log('renditionRef.current.book.spine.spineItems', renditionRef.current.book.spine.spineItems)
        // console.log('renditionRef.current.book.spine.spineItems[4]', renditionRef.current.book.spine.spineItems[4])
        // console.log('renditionRef.current.book.spine.spineItems[4].cfiFromElement', renditionRef.current.book.spine.spineItems[4].cfiFromElement)
        // console.log('renditionRef.current.book.spine.spineItems[4].contents', renditionRef.current.book.spine.spineItems[4].contents)

        // console.log(renditionRef.current.book.cfiFromElement)

        // var rangeRefCurrentChildren = rangeRef.current.querySelectorAll("*");
        // for (let item of rangeRefCurrentChildren) {
        //   console.log('item', item)
        //     console.log('item.length', item.length);
        //     console.log('item.value', item.value);
        //     console.log('item.nodeValue', item.nodeValue);
        // }


        console.log('range', range);
        let text = range.toString()
        remainingText.current = text;
        console.log('text', text);
        // console.log(text === "\n  ")
        if (remainingText.current && remainingText.current.length > 0 && remainingText.current !== "\n  ") {
          // currentRenditionText.current = text;
          // responsiveVoice.speak(remainingText.current, "UK English Female", parameters);
          // setPlaying(true);
        }
      })
    }
  }

  useEffect(() => {
    if (renditionRef.current) {
      function setRenderSelection(cfiRange, contents) {
        console.log('cfiRange', cfiRange)
        // console.log('contents', contents)
        // var range = contents.range(cfiRange);
        // console.log('range', range)
        // var text = renditionRef.current.getRange(cfiRange).toString();
        // console.log('text', text)
        // var rect = range.getBoundingClientRect();
        // console.log('rect', rect)
        // console.log('why')
        // setSelections(selections.concat({
        //   text: renditionRef.current.getRange(cfiRange).toString(),
        //   cfiRange
        // }))
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

  // const memoizedAnnotation = useMemo(() => {
  //   if (renditionRef.current) {
  //     renditionRef.current.annotations.add("highlight",
  //       _cfiRangeRef.current,
  //       {},
  //       null,
  //       "hl",
  //       { "fill": "red", "fill-opacity": "0.1", "mix-blend-mode": "difference" }
  //     )
  //   }
  // }, [renditionRef.current, _cfiRangeRef.current])

  // useEffect(() => {
  //   if (renditionRef.current) {
  //     console.log('fired')
  //     renditionRef.current.annotations.add("highlight",
  //       _cfiRangeRef.current,
  //       {},
  //       null,
  //       "hl",
  //       { "fill": "red", "fill-opacity": "0.1" }
  //     )
  //   }
  // }, [renditionRef.current, _cfiRangeRef.current])

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
        <div id="audio-controls">
          <img id="resume-button" className="audio-button" src="../assets/icons8-play-100.png" onClick={handleResume} />
          <img id="pause-button" className="audio-button" src="../assets/icons8-pause-100.png" onClick={handlePause} />
        </div>
      </div>
    </>
  )
}

export default App;
