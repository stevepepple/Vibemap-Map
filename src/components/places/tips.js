import React, { useState }  from 'react'
import { Link } from "react-router-dom"
import { withTranslation } from 'react-i18next'
import { isMobile } from 'react-device-detect';

import { Placeholder, Segment } from 'semantic-ui-react'

import CardCarousel from '../layouts/CardCarousel'
import Tip from '../elements/Tip'

import ListItems from '../layouts/ListItems.js'
import styles from '../../styles/ListItems.scss'

const Tips = (props) => {

    const { t, handleClick, recommendations } = props
    let { tips } = props.currentItem

    if (tips !== undefined) {
        let all_tips = tips.map((tip) => <Tip text={tip} />)
        tips = <CardCarousel items={all_tips} />
    }

    let items = []
    let has_recommendations = recommendations.length > 0
    if (has_recommendations) {
        items = recommendations.map((place, index) => {
            return <Link to={'/details/' + place.id}>
                <ListItems 
                    key={place.id} 
                    id={place.id} 
                    type={place.properties.place_type} 
                    link={place.properties.url} 
                    onClick={handleClick.bind(this, place.id)} 
                    properties={place.properties} 
                    index={index} />
            </Link>
        })
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

                        {has_recommendations &&
                            <div className='MobileCards ui items recommended'>
                                <h4>Recommended Nearby</h4>
                                <CardCarousel 
                                    items={items}
                                    height='10em'
                                    imageGallery={true}/>
                            </div>
                        }

                    </Segment>
                </div>
            )
        }
    </section>
}

export default withTranslation()(Tips) 