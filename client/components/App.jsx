import React, { useState } from 'react';
import Library from './Library/Library';

const App = () => {
  const [name, setName] = useState('BROTHER');
  return (
  <div>
    <Library />
  </div>
  )
};

export default App;