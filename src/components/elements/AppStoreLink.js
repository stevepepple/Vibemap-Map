import React, { Component } from 'react';
import ReactStoreBadges from 'react-store-badges'
import { Segment } from 'semantic-ui-react';

class AppStoreLink extends Component {
    render() {
        return (
            <Segment>
                <h4>Try the app!</h4>

                <ReactStoreBadges
                    platform={'ios'}
                    url={'https://apps.apple.com/us/app/hipcamp-camping-glamping/id1440066037'}
                    locale={'en-us'}
                />

                <ReactStoreBadges
                    platform={'android'}
                    url={'https://apps.apple.com/us/app/hipcamp-camping-glamping/id1440066037'}
                    locale={'en-us'}
                />
            </Segment>
        )
    }
}

export default AppStoreLink;