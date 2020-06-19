import React from "react"

import { connect } from "react-redux"

import { Link } from "gatsby"


import Header from '../components/elements/header'

export default function Home() {
    return <div>
        Hello world!

        Layout will go here. 

        <Link to='/hello/'>
            Hello
        </Link>

    </div>
}