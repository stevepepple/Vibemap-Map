import React, { Component } from 'react';
import { Button, Menu, Dropdown } from 'semantic-ui-react'
import SVG from 'react-inlinesvg'
import AppStoreLink from './AppStoreLink';

class SocialLinks extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount() {
    }

    render() {

        const { floated, link, instagram, facebook, twitter } = this.props
        
        return (
            <div>
                {link &&
                    <a href={link}>
                        <Button circular color='black' icon='linkify' />
                    </a>
                }

                {twitter != null &&
                    <a href={twitter}>
                        <Button circular color='black' icon='twitter' />
                    </a>
                }

                {instagram != null &&
                    <a href={instagram}>
                        <Button circular color='black' icon='instagram' />
                    </a>
                }
            </div>
        );
    }
}

// TODO: Add default props
SocialLinks.defaultProps = {
    link: null,
    facebook: null,
    instagram: null,
    twitter: null,
    floated: 'left',
    sharing: false
}

export default SocialLinks;