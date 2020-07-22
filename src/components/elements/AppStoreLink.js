import React, { Component } from 'react';
import ReactStoreBadges from 'react-store-badges'

import { connect } from 'react-redux'
import { Segment } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

class AppStoreLink extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { t, language } = this.props;

        let locale = language
        if (locale == 'es') locale = 'es-mx'

        return (
            <Segment>
                <h4>{t('Try the app!')}</h4>

                <ReactStoreBadges
                    platform={'ios'}
                    url={'https://apps.apple.com/us/app/hipcamp-camping-glamping/id1440066037'}
                    locale={locale}
                />

                <ReactStoreBadges
                    platform={'android'}
                    url={'https://apps.apple.com/us/app/hipcamp-camping-glamping/id1440066037'}
                    locale={locale}
                />
            </Segment>
        )
    }
}

const mapStateToProps = state => ({
    language: state.language
})

export default connect(mapStateToProps)(withTranslation()(AppStoreLink))
