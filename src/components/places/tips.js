import React, { useState }  from 'react'
import { withTranslation } from 'react-i18next';

import { Placeholder, Segment } from 'semantic-ui-react'

import CardCarousel from '../layouts/CardCarousel'
import Tip from '../elements/Tip'

const Tips = (props) => {

    const { t } = props
    let { tips } = props.currentItem

    if (tips !== undefined) {
        let all_tips = tips.map((tip) => <Tip text={tip} />)
        tips = <CardCarousel items={all_tips} />
    }

    return <section id='tips' name='tips'>
        {
            props.loading ? (
                <Placeholder>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder>
            ) : (
                <div>
                    <Segment vertical>
                        <h4>Tips</h4>
                        {tips}
                    </Segment>
                </div>
            )
        }
    </section>
}

export default withTranslation()(Tips) 