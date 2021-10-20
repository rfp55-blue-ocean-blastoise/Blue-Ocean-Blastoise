import React, { useState, useContext } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { GlobalContext } from "../GlobalContextProvider";

const Upload = (props) => {
  const [files, setFiles] = useState([]);
  const { value, setValue } = useContext(GlobalContext);

  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("epub", files)
    formData.append("user", value)
    axios.post('/upload', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then((response) => {
        console.log('This is response from upload: ', response);
        props.handleCloseUpload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>Upload Your eBook (EPUB)</h1>
      <input
        name='epub'
        type='file'
        accept='.epub'
        onChange={(e) => setFiles(e.target.files[0])}
      />
      <Button
        style={{ backgroundColor: '#FFFDD0' }}
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

/*
import React, { useState, useContext } from "react";
import { GlobalContext } from "./GlobalContextProvider";
import axios from "axios";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const { value, setValue } = useContext(GlobalContext);

  const post = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("epub", files)
    formData.append("user", value)
    axios.post('/upload', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <form onSubmit={post} encType="multipart/form-data">
        <input
          name="epub"
          type="file"
          accept=".epub"
          onChange={(e) => setFiles(e.target.files[0])}
        ></input>
        <input type="submit"></input>
      </form>
    </div>
  );
};

export default Upload;
*/