import React, { useState } from 'react';
import Home from './Library/Home';

const App = () => {
  const [name, setName] = useState('BROTHER');
  return (
  <div>
    <Home />
  </div>
  )
};

export default App;