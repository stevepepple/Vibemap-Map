import React, { Component } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button, Popup } from 'semantic-ui-react'

import * as style_variables from 'vibemap-constants/design-system/build/json/variables.json'

import {
    FacebookIcon,
    FacebookShareButton,
    PinterestIcon,
    PinterestShareButton,
    TwitterShareButton,
    TwitterIcon
} from "react-share"


class SocialShare extends Component {

    constructor(props) {
        super(props)

        this.state = {
            copiedLink: false
        } 
    }

    componentDidMount() {
    }

    onLinkClick() {
        console.log('Set clipboard: ', this.state)
        this.setState({ copiedLink: true })

        setTimeout(() => this.setState({ copiedLink: false }), 4000)
    }

    render() {

        const { link, instagram, facebook, pinterest, twitter } = this.props
        const { copiedLink } = this.state

        const black = style_variables.color.base.black
        const white = style_variables.color.base.white
        const bgStyle = { fill : black }

        
        // TODO: Universal way to handle urls
        let url = link
        if (url === null && typeof window !== 'undefined') url = window.location.href

        return (

            <div className='SocialShare'>
                {url &&
                    <Popup on='click' open={copiedLink} trigger={
                        <CopyToClipboard text={url}
                            onCopy={() => this.onLinkClick()}>
                            <Button circular color='black' icon='linkify' size='large' />
                        </CopyToClipboard>
                    }>
                        <Popup.Content>Copied to clipboard</Popup.Content>
                    </Popup>
                }
                <div className='share-buttons'>
                    <span>
                        {twitter &&
                            <TwitterShareButton url={url}>
                                <TwitterIcon size={42} bgStyle={bgStyle} round={true} />
                            </TwitterShareButton>
                        }

                        {facebook &&
                            <FacebookShareButton url={url}>
                                <FacebookIcon size={42} bgStyle={bgStyle} round={true} />
                            </FacebookShareButton>
                        }

                        {pinterest &&
                            <PinterestShareButton url={url}>
                                <PinterestIcon size={42} bgStyle={bgStyle} round={true} />
                            </PinterestShareButton>
                        }
                    </span>

                </div>

            </div>
        );
    }
}

// TODO: Add default props
SocialShare.defaultProps = {
    link: null,
    facebook: true,
    instagram: false,
    pinterest: true,
    twitter: true,
    floated: 'left'
}

export default SocialShare;