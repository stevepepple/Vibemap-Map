import React from "react";
import { Link } from 'react-router-dom';
import "./NewsList.scss";

import { Helmet } from 'react-helmet-async'

export default function NewsList({ news }) {
  return (
    <div className="newslist">
      <Helmet>
        <title>News at Vibemap</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
        <meta
          name="description"
          content="Amazing Tech Talks curated by the community ❤️"
        />
      </Helmet>
      <div className="header">
        <strong>Wizard News</strong>
        <Link to="/">Home</Link>
      </div>
      {news &&
        news.map(post =>
          <div key={post.id}>
            <p>
              {post.id} ⬆ {post.title}
            </p>
            <small>
              {post.upvotes} upvotes by {post.author}
            </small>
          </div>
        )}
    </div>
  );
}
