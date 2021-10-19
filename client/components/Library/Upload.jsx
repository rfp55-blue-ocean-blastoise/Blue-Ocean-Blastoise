import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const Upload = (props) => {
  const [files, setFiles] = useState('');

  const handleUpload = (e) => {
    e.preventDefault();
    props.handleCloseUpload();
    /*
    const request = {
      method: 'POST',
      url: '/upload',
      data: files,
    };
    axios(request)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
    */
  };
  return (
    <div>
      <h1>Upload Your eBook (EPUB)</h1>
      <input
        type='file'
        onChange={(e) => setFiles(e.target.files[0])}
      />
      <Button
        style={{ backgroundColor: '#11A797' }}
        variant='contained'
        component='label'
        type='button'
        onClick={handleUpload}
      >
        Upload&nbsp;
        <FileUploadIcon />
      </Button>
    </div>
  );
};

export default Upload;