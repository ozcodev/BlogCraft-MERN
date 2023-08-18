import React from 'react';
import './App.css';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export const Post = ({_id, title, summary, cover, content, createdAt, author }) => {
  return (
    <div>
      <div className="post">
        <div className="imag">
          <Link to={`/post/${_id}`}>
            <img src={'http://localhost:4040/' + cover} alt="blog image" />
          </Link>
        </div>

        <div className="text_Side">
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>
          <p className="info">
            {author && author.username ? (
              <a className="author">{author.username}</a>
            ) : (
              <span>anonymous</span>
            )}
            <time>{format(new Date(createdAt), 'HH:mm MMM,d yyyy')}</time>
          </p>
          <p className="summary">
            {summary} &nbsp;
            <a href="" className="read">
              Read more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
