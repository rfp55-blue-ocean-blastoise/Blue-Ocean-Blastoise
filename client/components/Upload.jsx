import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {

  const [files, setFiles] = useState('')

  const post = (event) => {
    event.preventDefault();
    const request = {
      method: 'POST',
      url: '/upload',
      data: files,
    }
    axios(request)
    .then((result)=> console.log(result))
    .catch(err=> console.log(err))
  }
  return (
  <div>
    <form onSubmit={post}>

      <input type='file' onChange={e=>setFiles(e.target.files[0])}></input>
      <input type='submit'></input>
    </form>

  </div>
  )
}

export default Upload;