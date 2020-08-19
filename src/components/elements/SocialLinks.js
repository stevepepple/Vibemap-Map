import React, { Component } from 'react';
import { Button, Menu, Dropdown } from 'semantic-ui-react'
import SVG from 'react-inlinesvg'
import AppStoreLink from './AppStoreLink'

import helpers from '../../helpers.js'

class SocialLinks extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount() {
    }

    render() {

        const { floated, link, instagram, facebook, twitter } = this.props

        // Get fulling formed links regardless of link format
        const twitter_link = helpers.getFullLink(twitter, 'twitter')
        const instagram_link = helpers.getFullLink(instagram, 'instagram')
        
        return (
            <div>
                {link &&
                    <a href={link} target='_blank'>
                        <Button circular color='black' icon='linkify' />
                    </a>
                }

                {twitter_link != null &&
                    <a href={twitter_link} target='_blank'>
                        <Button circular color='black' icon='twitter' />
                    </a>
                }

                {instagram_link != null &&
                    <a href={instagram_link} target='_blank'>
                        <Button circular color='black' icon='instagram' />
                    </a>
                }
            </div>
        );
    }
}

SocialLinks.defaultProps = {
    link: null,
    facebook: null,
    instagram: null,
    twitter: null,
    floated: 'left',
    sharing: false
}

export default SocialLinks;