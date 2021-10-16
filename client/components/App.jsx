import React, { useState } from 'react';
import Upload from './Upload.jsx'

const App = () => {
  const [name, setName] = useState('BROTHER');
  return (
  <div>
    <h1>HELLO {name}</h1>
    <Upload/>
  </div>
  )
}

export default App;