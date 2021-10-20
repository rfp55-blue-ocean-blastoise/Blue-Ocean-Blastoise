import React, { useRef, useState, useEffect } from "react";
import { ReactReader } from "react-reader";
import axios from 'axios';
import Button from '@mui/material/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import ModalUnstyled from '@mui/core/ModalUnstyled';
import { styled } from '@mui/system';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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
  const [speedValue, setSpeedValue] = useState(30);
  const [pitchValue, setPitchValue] = useState(30);
  const [openSettings, setOpenSettings] = useState(false);
  const [anchorElFont, setAnchorElFont] = useState(null);
  const openFont = Boolean(anchorElFont);
  const [anchorElVoice, setAnchorElVoice] = useState(null);
  const openVoice = Boolean(anchorElVoice);
  const handleClickFontSize = (e) => {
    setAnchorElFont(e.currentTarget);
  };
  const handleCloseFontSize = () => {
    setAnchorElFont(null);
  };
  const handleSelectFontSize = (size) => {
    console.log('This is selected size: ', size);
    handleCloseFontSize();
  };
  const handleClickVoiceOption = (e) => {
    setAnchorElVoice(e.currentTarget);
  };
  const handleCloseVoiceOption = () => {
    setAnchorElVoice(null);
  };
  const handleSelectVoiceOption = (voice) => {
    console.log('This is selected voice option: ', voice);
    handleCloseVoiceOption();
  };

  const handleVolumeChange = (e) => {
    e.preventDefault();
    setVolumeValue(e.target.value);
    console.log('This is volume value', volumeValue);
  }
  const handleSpeedChange = (e) => {
    e.preventDefault();
    setSpeedValue(e.target.value);
    console.log('This is speed value', volumeValue);
  }
  const handlePitchChange = (e) => {
    e.preventDefault();
    setPitchValue(e.target.value);
    console.log('This is pitch value', volumeValue);
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
            onClick={() => setOpenSettings(true)}
          >
            <SettingsIcon />
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
            id="demo-positioned-button"
            aria-controls="demo-positioned-menu"
            aria-haspopup="true"
            aria-expanded={openFont ? 'true' : undefined}
            style={{ marginRight: '1rem', backgroundColor: '#11A797' }}
            variant='contained'
            type='button'
            onClick={handleClickFontSize}
          >
            <FormatSizeIcon />
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorElFont}
            open={openFont}
            onClose={handleCloseFontSize}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
          {['25%', '50%', '100%', '125%', '150%', '175%', '200%'].map(item => (
            <MenuItem style={{ fontSize: '1rem'}} onClick={() => handleSelectFontSize(item)}>{item}</MenuItem>
          ))}
          </Menu>
        </div>
      </div>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        BackdropComponent={Backdrop}
      >
        <Box sx={style}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 1rem 1rem 0'}}>
            <h2 style={{ textAlign: 'center' }}>Volume&nbsp;</h2>
            <div style={{ width: '15rem', display: 'flex', justfyContent: 'center', alignItems: 'center', marginTop: '0.3rem'}}>
              <VolumeDown />
              <Slider style={{ color: '#11A797', margin: '0 0.5rem'}} aria-label="Volume" value={volumeValue} onChange={handleVolumeChange} />
              <VolumeUp />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 1rem 1rem 0'}}>
            <h2 style={{ textAlign: 'center' }}>Speed&nbsp;</h2>
            <div style={{ width: '15rem', display: 'flex', justfyContent: 'center', alignItems: 'center', marginTop: '0.3rem'}}>
              <RemoveIcon />
              <Slider style={{ color: '#11A797', margin: '0 0.5rem'}} aria-label="Volume" value={speedValue} onChange={handleSpeedChange} />
              <AddIcon />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 1rem 1rem 0'}}>
            <h2 style={{ textAlign: 'center' }}>Pitch&nbsp;</h2>
            <div style={{ width: '15rem', display: 'flex', justfyContent: 'center', alignItems: 'center', marginTop: '0.3rem'}}>
              <RemoveIcon />
              <Slider style={{ color: '#11A797', margin: '0 0.5rem'}} aria-label="Volume" value={pitchValue} onChange={handlePitchChange} />
              <AddIcon />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 1rem 1rem 0'}}>
          <h2 >Voice Options</h2>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls="long-menu"
              aria-expanded={openVoice ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClickVoiceOption}
            >
              <MoreVertIcon />
            </IconButton>
            </div>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorElVoice}
              open={openVoice}
              onClose={handleCloseVoiceOption}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                style: {
                  maxHeight: '5rem',
                  width: '8rem',
                },
              }}
            >
              {voiceOptions.map((option) => (
                <MenuItem key={option} selected={option === 'Default'} onClick={() => handleSelectVoiceOption(option)}>
                  {option}
                </MenuItem>
              ))}
            </Menu>
        </Box>
      </StyledModal>
    </div>
  )
};

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: 400,
  bgcolor: '#FFFDD0',
  border: '2px solid #000',
  p: 2,
  px: 4,
  pb: 3,
};

const voiceOptions = [
  'Default',
  'Option1',
  'Option2',
  'Option3',
  'Option4',
  'Option5',
  'Option6',
];

export default Player;