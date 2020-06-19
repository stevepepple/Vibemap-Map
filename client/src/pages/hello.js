import React from "react"

import { graphql } from "gatsby"

import { connect } from "react-redux"

import { Link } from "gatsby"

export default function Hello({ data }) {
    console.log(data)
    return <div>
        <h1>
            {data.site.siteMetadata.title}
        </h1>

        Hello world!!!
        <br/>

        <img
            src="https://2.bp.blogspot.com/-BMP2l6Hwvp4/TiAxeGx4CTI/AAAAAAAAD_M/XlC_mY3SoEw/s1600/panda-group-eating-bamboo.jpg"
            alt="Group of pandas eating bamboo"
        />

        <br/>
        <Link to='/' >
            Home
        </Link>

    </div>
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`