import React from "react";

import Media from 'react-media'

export default function MobileAdaptive({ mobile, web }) {
  return (
      <Media query="(max-width: 599px)">
          {matches =>
            matches ? (
                mobile
            ) : (
                web
            )
          }
      </Media>
  );
}
