import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [files, setFiles] = useState([]);

  const post = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("epub", files)

    console.log('WALMART ',formData)
    axios.post('/upload', formData ,{headers: {'Content-Type': 'multipart/form-data'}})
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
