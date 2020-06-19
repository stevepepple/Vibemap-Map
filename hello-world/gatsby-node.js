/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// Example plugin for creating slugs from filesystem nodes
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node }) => {
    console.log(node.internal.type)

    console.log(createFilePath({ node, getNode, basePath: `pages` }))

}