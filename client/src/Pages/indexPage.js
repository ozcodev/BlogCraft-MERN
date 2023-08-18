import React, { useEffect, useState } from 'react';
import { Post } from '../post';

const IndexPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4040/post').then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    /*  <>
      <Post />
      <Post />
      <Post />
    </> */

    <>
      {posts.length > 0 &&
        posts.map((post) => (
          <Post
            {...post}
          />
        ))}
    </>
  );
};

export default IndexPage;
