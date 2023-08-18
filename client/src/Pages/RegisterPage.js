import React, { useState } from 'react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const register = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4040/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-type': 'application/json' },
      });

      if(response.ok === false){
        alert('Waaaaaaaaaaaaaaa Error, Try again')
      } 
    
  };
  return (
    <div>
      <form className="register" onSubmit={register}>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
