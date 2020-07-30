import React, { Component } from 'react';
import { Button, Menu, Dropdown } from 'semantic-ui-react'
import SVG from 'react-inlinesvg'
import AppStoreLink from './AppStoreLink';


class AppLink extends Component {

    constructor(props) {
        super(props)

        this.state = {
            os: 'ios',
            appStore: {
                'ios': 'https://testflight.apple.com/join/muWP05xp',
                'android': 'https://play.google.com/store/apps/details?id=com.vibemap.hotspots&hl=en_US',
                'fallback': 'vibemap.com'
            },
            link: this.props.link
        }

        this.openLink = this.openLink.bind(this)

    }

    componentDidMount() {
        const os = this.getOS()
        console.log('AppLink: ', os, this.state)
    }

    openLink() {

        const { os, link, appStore } = this.state
        const storeLink = appStore[os]

        console.log('Trying to open this link', link, storeLink)

        setTimeout(function () { window.location = storeLink }, 1000);
        window.location = link;
    }

    getOS() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "windows";
        }

        if (/android/i.test(userAgent)) {
            return "android";
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "ios";
        }

        return navigator.userAgent;
    }


    render() {
        
        return (
            <Button basic color='black' style={{ width: '9em', position: 'absolute', right: '1em', top: '1.4em', zIndex: 14 }} onClick={this.openLink}>
                Open in App
            </Button>
        );
    }
}

// TODO: Add default props
AppLink.defaultProps = {
    link: 'vibemap://discover/',
}

export default AppLink;