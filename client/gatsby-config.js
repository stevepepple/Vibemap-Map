module.exports = {
    siteMetadata: {
        title: `Vibemap`,
    },
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `src`,
                path: `${__dirname}/src/`,
            },
        },
    ],

    // Plugins go here
}