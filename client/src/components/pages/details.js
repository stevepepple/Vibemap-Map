import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Helmet } from 'react-helmet';


const Details = props => {
    const { title, description } = props

    return (
        <div>
            <Helmet>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
            </Helmet>

            {description}
        </div>
    ) 
}

Details.defaultProps = {
    title: 'Details Titles will Go Here',
    description: 'Details Description will Go here.',
}

function mapStateToProps(state) {
    return {

    };
}

export default connect(
    mapStateToProps,
)(Details);