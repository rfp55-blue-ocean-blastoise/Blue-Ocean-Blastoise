import React, { useState } from 'react';

const App = () => {
  const [name, setName] = useState('BROTHER');
  return (
  <div>
    <h1>HELLO {name}</h1>
  </div>
  )
}

export default App;