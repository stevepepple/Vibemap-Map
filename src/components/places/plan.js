import React from 'react'
import { withTranslation } from 'react-i18next';

import { Button, Icon, Label, Placeholder, Segment } from 'semantic-ui-react'


const Plan = (props) => {

    const { t } = props
    let { categories, hours, address, instagram, twitter, url } = props.currentItem

    if (props.currentItem.categories.length > 0) {
        categories = props.currentItem.categories.map((category) => <Label key={category} className={'image label ' + category}>{category}</Label>);
    }

    return <section id='plan' name='plan' >
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
                            <h4>{t('Hours')}</h4>
                            {hours ? hours : t('No hours')}
                        </Segment>
                        <Segment vertical>
                            <h4>{t('Location')}</h4>
                            {address ? address : t('No location')}
                        </Segment>
                        <Segment vertical>
                            <h4>{t('Web & Social')}</h4>
                            {url 
                                ? <a href={url}>{url}</a> 
                                : t('No website')}
                            <Button.Group floated='right'>
                                {twitter != null &&
                                    <a href={instagram}>
                                        <Button circular color='black' icon='instagram' />                                    
                                    </a>
                                }
                                <Button circular color='black' icon='link' />

                                {instagram != null &&
                                    <a href={instagram}>
                                        <Button circular color='black' icon='instagram' />
                                    </a>
                                }
                            </Button.Group>

                        </Segment>
                    </div>
                )
        }
    </section>
}

export default withTranslation()(Plan)