import React, { Component } from "react";

import { Helmet } from 'react-helmet-async'

const SEO = props => {
    console.log('props in SEO: ', props)
    const { title, description, image, locale, website } = props

    return <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />

        <meta name="description" content={description} />
        <meta property="og:description" content={description} />

        <meta property="og:image" content={image} /> 
        <meta property="og:site_name" content={website}/>
        <meta property="og:locale" content={locale} />


        <meta name="twitter:title" content="Awesome Talks" />
        <meta name="twitter:description" content={description}/>
        <meta name="twitter:image" content="https://file-iloqdynwox.now.sh/" />
        <meta name="twitter:image:alt" content="awesome talks" />
    </Helmet>;    
}

SEO.defaultProps = {
    title:'Vibemap',
    company: 'Vibemap',
    image: 'https://pbs.twimg.com/profile_images/1270800120452222977/GFhjmGCz_400x400.jpg',
    website: 'Vibemap.com',
    locale: 'Oakland',
    description: 'Find your vibe',    
}

export default SEO