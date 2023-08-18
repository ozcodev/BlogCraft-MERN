import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './userContext';

export const Header = () => {
  //instead we use the line useState below ,we use useContext
  //const [username, setUsername] = useState(null);

  const { setUserInfo, userInfo } = useContext(UserContext);
  const username = userInfo?.username;

  useEffect(() => {
    fetch('http://localhost:4040/profile', {
      credentials: 'include',
    }).then((response) => {
      response.json().then((userInfo) => {
        //setUsername(userInfo.username);
        setUserInfo(userInfo);
      });
    });
  }, []);

  const logout = () => {
    fetch('http://localhost:4040/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  };

  return (
    <header>
      <Link to="/" className="logo">
        Blog
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new Blog</Link>
            {/* <span>Welcome back, {username}</span> */}
            <a onClick={logout}>Logout</a>
          </>
        )}

        {!username && (
          <>
            <Link to="/login" className="">
              Login
            </Link>
            <Link to="/register" className="">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};
