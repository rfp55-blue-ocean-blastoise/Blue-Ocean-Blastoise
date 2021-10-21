import React, { useRef, useState, useEffect } from "react"
import { ReactReader } from "react-reader"
import $ from "jquery";

// Books
const accessible = "https://blueocean.s3.us-west-1.amazonaws.com/accessible_epub_3+(1).epub";
const moby = "https://s3.amazonaws.com/moby-dick/OPS/package.opf";
const alice = "https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf";

console.log(responsiveVoice.enableEstimationTimeout);
responsiveVoice.enableEstimationTimeout = false;
console.log(responsiveVoice.enableEstimationTimeout);

console.log(responsiveVoice);
responsiveVoice.enableWindowClickHook();

// function loop() {
//   console.log('does this work')
//   if (responsiveVoice) {
//     if (responsiveVoice.currentMsg) {
//        console.log('current message', responsiveVoice.currentMsg)
//        if (responsiveVoice.currentMsg.text) { console.log('current message text', responsiveVoice.currentMsg.text) }
//   }
//   }
//     setTimeout(function () {
//     // execute script
//     loop()
//   }, 500);
// };

// loop();


/**************************************************************************************************************
Use getRangeFromEl on iframe section child
***************************************************************************************************************/

const App = () => {
  const [page, setPage] = useState('')
  const [location, setLocation] = useState(null)
  const [selections, setSelections] = useState([])
  // const [currentRenditionText, setCurrentRenditionText] = useState('');
  // const [remainingRenditionText, setRemainingRenditionText] = useState('');
  const currentRenditionText = useRef('');
  const remainingRenditionText = useRef('');

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

  //   setInterval(function(){
  //     //this code runs every second
  //     console.log('does this work')
  // }, 1000);



  function searchAndHighlight(searchTerm, selector) {
    if (searchTerm) {
      //var wholeWordOnly = new RegExp("\\g"+searchTerm+"\\g","ig"); //matches whole word only
      //var anyCharacter = new RegExp("\\g["+searchTerm+"]\\g","ig"); //matches any word with any of search chars characters
      // var selector = selector || "#realTimeContents"; //use body as selector if none provided
      var selector = selector || rangeRef.current; //use body as selector if none provided
      var searchTermRegEx = new RegExp(searchTerm, "ig");
      var matches = $(selector).text().match(searchTermRegEx);
      console.log('first matches', matches)
      console.log('$(selector)', $(selector))
      console.log('test selector', $(rangeRef.current))

      console.log('$(selector).children()', $(selector).children())


      if (matches != null && matches.length > 0) {
        $('.highlighted').removeClass('highlighted'); //Remove old search highlights

        //Remove the previous matches
        // const $span = $('#realTimeContents span');
        // $span.replaceWith($span.html());

        if (searchTerm === "&") {
          searchTerm = "&amp;";
          searchTermRegEx = new RegExp(searchTerm, "ig");
        }
        // $(selector).html($(selector).html().replace(searchTermRegEx, "<span class='match'>" + searchTerm + "</span>"));
        $(selector).children().each((index, child) => {
          console.log('before', index, child);
          $(child).html($(child).html().replace(searchTermRegEx, "<span class='match'>" + searchTerm + "</span>"));
          console.log('after', index, child);
        })
        // $(selector).html($(selector).html().replace(searchTermRegEx, "<span class='match'>" + searchTerm + "</span>"));
        // $(selector).children().each((index, child) => {
        //   console.log('after', index, child);
        // })

        // $('.match:first').addClass('highlighted');
        $(selector).querySelector('.match:last').addClass('highlighted');
        console.log($('.match:last'))

        var i = 0;

        $('.next_h').off('click').on('click', function () {
          i++;

          if (i >= $('.match').length) i = 0;

          $('.match').removeClass('highlighted');
          $('.match').eq(i).addClass('highlighted');
          $('.ui-mobile-viewport').animate({
            scrollTop: $('.match').eq(i).offset().top
          }, 300);
        });
        $('.previous_h').off('click').on('click', function () {

          i--;

          if (i < 0) i = $('.match').length - 1;

          $('.match').removeClass('highlighted');
          $('.match').eq(i).addClass('highlighted');
          $('.ui-mobile-viewport').animate({
            scrollTop: $('.match').eq(i).offset().top
          }, 300);
        });

        if ($('.highlighted:first').length) { //if match found, scroll to where the first one appears
          $(window).scrollTop($('.highlighted:first').position().top);
        }
        return true;
      }
    }
    return false;
  }

  $(document).on('click', '.searchButtonClickText_h', function (event) {

    $(".highlighted").removeClass("highlighted").removeClass("match");
    if (!searchAndHighlight($('.textSearchvalue_h').val())) {
      alert("No results found");
    }


  });



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
    volume: 0.8
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
        console.log('range', range);
        console.log('range commonAncestorContainer', range.commonAncestorContainer);
        console.log('range commonAncestorContainer selector', range.commonAncestorContainer.querySelectorAll("*"));
        // console.log('range start', range.startContainer.parentNode);
        // console.log('range end', range.endContainer.parentNode);
        rangeRef.current = range.commonAncestorContainer;
        console.log('rangeRef.current', rangeRef.current)
        let text = range.toString()
        remainingText.current = text;
        console.log('text', text);
        // console.log(text === "\n  ")
        if (remainingText.current && remainingText.current.length > 0 && remainingText.current !== "\n  ") {
          currentRenditionText.current = text;
          responsiveVoice.speak(remainingText.current, "UK English Female", parameters);
          setPlaying(true);
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
    // const matches = document.querySelectorAll("div");
    // console.log('matches', matches)
    // const match = document.querySelector(".epub-container");
    var match = document.querySelector(".epub-container");
    const wrapper = document.getElementById("react-reader-wrapper");
    console.log('wrapper', wrapper)
    console.log('match', match)
  }, [setSelections, selections])

  return (
    <>
      <div id="react-reader-wrapper" style={{ height: "100vh" }} className="searchContend_h" >
        <ReactReader
          location={location}
          locationChanged={locationChanged}
          url={accessible}
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
        {/* <div class="searchContend_h"> */}
        <div>
          <div class="ui-grid-c">
            <div class="ui-block-a">
              <input name="text-12" id="text-12" type="text" class="textSearchvalue_h" />
            </div>
            <div class="ui-block-b"> <a href="#" data-role="button" data-corners="false" data-inline="true" class="searchButtonClickText_h">Search</a>

            </div>
            <div class="ui-block-c"> <a href="#" data-role="button" data-corners="false" data-inline="true" class="next_h">Next</a>

            </div>
            <div class="ui-block-d"> <a href="#" data-role="button" data-corners="false" data-inline="true" class="previous_h">Previous</a>

            </div>
            <div id="realTimeContents">
              naveendf$dfsdmfjhjjdsjjdsjkjkaskakskkdsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdfsjkdfjksjkdfsjkjkjkdfsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdjkds kfskdjfksd; k dl;kfs;kf ;ks;kf;k;lkkkklll;k dfdfsdmfjhjjdsjjdsjkjkaskakskkdsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdfsjkdfjksjkdfsjkjkjkdfsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdjkds kfskdjfksd; k dl;kfs;kf ;ks;kf;k;lkkkklll;k dfdfsdmfjhjjdsjjdsjkjkaskakskkdsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdfsjkdfjksjkdfsjkjkjkdfsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdjkds kfskdnaveen jfksd; k dl;kfs;kf ;ks;kf;k;lkkkklll;k dfdfsdmfjhjjdsjjdsjkjkaskakskkdsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdfsjkdfjksjkdfsjkjkjkdfsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdjkds kfskdjfksd; k dl;kfs;kf ;ks;kf;k;lkkkklll;k dfdfsdmfjhjjdsjjdsjkjkaskakskkdsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdfsjkdfjksjkdfsjkjkjkdfsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdjkds kfskdjfksd; k dl;kfs;kf ;ks;kf;k;lkkkklll;k naveen naveendfdfsdmfjhjjdsjjdsjkjkaskakskkdsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdfsjkdfjksjkdfsjkjkjkdfsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdjkds kfskdjfksd; k dl;kfs;kf ;ks;kf;k;lkkkklll;k dfdfsdmfjhjjdsjjdsjkjkaskakskkdsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdfsjkdfjksjkdfsjkjkjkdfsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdjkds kfskdjfksd; k dl;kfs;kf ;ks;kf;k;lkkkklll;k dfdfsdmfjhjjdsjjdsjkjkaskakskkdsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdfsjkdfjksjkdfsjkjkjkdfsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdjkds kfskdnaveen jfksd; k dl;kfs;kf ;ks;kf;k;lkkkklll;k dfdfsdmfjhjjdsjjdsjkjkaskakskkdsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdfsjkdfjksjkdfsjkjkjkdfsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdjkds kfskdjfksd; k dl;kfs;kf ;ks;kf;k;lkkkklll;k dfdfsdmfjhjjdsjjdsjkjkaskakskkdsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdfsjkdfjksjkdfsjkjkjkdfsfjkdfjksjkdfsjkjkdfsjkdfsjkjkdjkds kfskdjfksd; k dl;kfs;kf ;ks;kf;k;lkkkklll;k naveen
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
