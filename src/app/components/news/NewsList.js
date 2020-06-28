import React from "react";
import { Link } from 'react-router-dom';
import "./NewsList.scss";

import { Helmet } from 'react-helmet-async'
import SEO from '../../../components/seo/'


export default function NewsList({ news }) {
  return (
    <div className="newslist">
      <SEO />
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
