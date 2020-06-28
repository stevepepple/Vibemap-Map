import React, { Component } from "react";

import { Helmet } from 'react-helmet-async'

export default function SEO() {
    return <Helmet>
        <title>Awesome Talks</title>
        <meta
            name="description"
            content="Amazing Tech Talks curated by the community ❤️"
        />
        <meta name="twitter:title" content="Awesome Talks" />
        <meta
            name="twitter:description"
            content="Amazing Tech Talks curated by the community ❤️"
        />
        <meta name="twitter:image" content="https://file-iloqdynwox.now.sh/" />
        <meta name="twitter:image:alt" content="awesome talks" />
    </Helmet>;    
}

