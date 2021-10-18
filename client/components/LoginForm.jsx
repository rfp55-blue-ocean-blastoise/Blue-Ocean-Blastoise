import React from 'react';

const LoginForm = ({username}) => {
  return (
    <div>
      <form>
        <input type="text" className="user-name" value={username}></input>
      </form>
    </div>
  )
}

export default LoginForm;