import React, { useState } from 'react';
import Upload from './Upload.jsx'
import Signup from './Signup.jsx';

const App = () => {
  const [name, setName] = useState('BROTHER');
  return (
  <div>
    <h1>HELLO {name}</h1>
    <Upload/>
    <Signup/>
  </div>
  )
}

export default App;