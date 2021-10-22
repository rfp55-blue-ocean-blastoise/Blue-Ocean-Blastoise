import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from "../GlobalContextProvider";

const Upload = (props) => {
  const [files, setFiles] = useState([]);
  const { value, setValue } = useContext(GlobalContext);

  const handleUpload = (e) => {
    e.preventDefault();
    console.log('upload clicked!')
    const formData = new FormData();
    formData.append("epub", files);
    formData.append("email", value);
    axios.post('/account/upload', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then((response) => {
        console.log('This is response from upload: ', response);
        props.handleCloseUpload();
        props.getUserData();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ fontSize: '2vh' }}>Upload Your eBook (EPUB)</h1>
      <form onSubmit={handleUpload} encType="multipart/form-data">
        <input
          name='epub'
          type='file'
          accept='.epub'
          onChange={(e) => setFiles(e.target.files[0])}
        />
        <input
          type='submit'
        >
        </input>
      </form>
    </div>
  );
};

export default Upload;