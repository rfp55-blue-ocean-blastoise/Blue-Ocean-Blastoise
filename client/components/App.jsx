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

import React, { useRef, useState } from "react"
import { ReactReader } from "react-reader"

const App = () => {
  const [page, setPage] = useState('')
  const renditionRef = useRef(null)
  const tocRef = useRef(null)
  const locationChanged = (epubcifi) => {
    if (renditionRef.current && tocRef.current) {
      const { displayed, href } = renditionRef.current.location.start
      const chapter = tocRef.current.find((item) => item.href === href)
      setPage(`Page ${displayed.page} of ${displayed.total} in chapter ${chapter ? chapter.label : 'n/a'}`)
      // console.log('current rendition', renditionRef.current)
      // console.log('current location', renditionRef.current.location)
      // console.log('current location start', renditionRef.current.location.start)
      // console.log('current location end', renditionRef.current.location.end)
      console.log('current location start cfi', renditionRef.current.location.start.cfi)
      console.log('current location end cfi', renditionRef.current.location.end.cfi)

      const locationStartCfi = renditionRef.current.location.start.cfi;
      const locationEndCfi = renditionRef.current.location.end.cfi;

      const breakpoint = locationStartCfi.indexOf(']!') + 6;
      const base = locationStartCfi.substring(0, breakpoint);
      const startRange = locationStartCfi.substring(breakpoint, locationStartCfi.length - 1);
      const endRange = locationEndCfi.substring(breakpoint, locationEndCfi);
      const cfiRange = `${base},${startRange},${endRange}`;

      console.log('base', base);
      console.log('startRange', startRange);
      console.log('endRange', endRange);
      console.log('cfiRange', cfiRange);

      // book.getRange(cfiRange).then(function (range) {
      //   console.log('range', range);
      //   let text = range.toString()
      //   console.log('text', text);
      //   // console.log(text === "\n  ")
      //   if (text && text.length > 0 && text !== "\n  ") {
      //     responsiveVoice.speak(text, "UK English Female", parameters);
      //   }
      // })

    }
  }
  return (
    <>
      <div style={{ height: "100vh" }}>
        <ReactReader
          locationChanged={locationChanged}
          url="https://gerhardsletten.github.io/react-reader/files/alice.epub"
          getRendition={(rendition) => renditionRef.current = rendition}
          tocChanged={toc => tocRef.current = toc}
        />
      </div>
      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', left: '1rem', textAlign: 'center', zIndex: 1}}>
        {page}
      </div>
    </>
  )
}

export default App;
