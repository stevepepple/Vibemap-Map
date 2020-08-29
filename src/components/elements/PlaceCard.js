import React, { Fragment, useState } from 'react'
import { Item, Icon, Label, Button } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next'

import helpers from '../../helpers'

import styles from './PlaceCard.scss'


function cardPLaceLayout(props) {
    const { properties, t } = props
    
    let content = properties

    const [saved, setSaved] = useState(content.is_saved);

    let name = content.name  
 
    let categories = null
    let distance = null
    let venue = null
    let vibes = null
    let openNow = null
    let openTil = null
    let hoursToday = null

    // TODO: Move to server side
    if (name) {
        name = name.split(' | ')
        name = name[0]
    }

    const handleClick = (e, place) => {
        // Don't click throught parent list item
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation()

        // Callback to Main HOC and Redux
        const { onSavePlace } = props
        onSavePlace(e, place)

        // Track saved state in this component
        setSaved(!saved)
    } 

    // Format individual fields
    if (typeof content.vibes !== "undefined") {
        let remainder = content.vibes.length - 1
        vibes = null

        let first_vibe = content.vibes[0]
        let first_vibe_text = helpers.toTitleCase(first_vibe)

        // TODO: Hack to fix empty vibes
        if (first_vibe === "") first_vibe = content.vibes.shift()

        // Handle vibe label layout
        if (remainder > 0) vibes = <div className='vibes'>
                <Label
                    circular 
                    key={content.vibes[0]}
                    className={'vibe label tiny' + content.vibes[0]}
                    style={helpers.getVibeStyle(first_vibe)}>
                    {first_vibe}
                </Label>
                <Label circular title={'See all ' + remainder + 'vibes.'}>+ {remainder} vibes</Label>
            </div>
        if (remainder === 0) vibes = <div className='vibes'><Label key={content.vibes[0]} className={'vibe label ' + content.vibes[0]}>{first_vibe_text}</Label></div>

    }

    // TODO: Make this a component and internationalize it.    
    let score = helpers.scaleScore(content.average_score)
    
    let recommendation = <span className={props.index === 0 ? 'recommendation top_match' : 'recommendation'}>
        <div className='score'>{score}%</div>
        <div className='reason'>{t('your vibe')}</div>
    </span>

    if (typeof (content.categories) == 'object' && content.categories.length > 0) {
        categories = content.categories.map((category) => <span key={category} className={category}>{category}</span>)
    } else {
        categories = helpers.toTitleCase(content.categories)
    }

    if (content.venue) venue = <span className='venue'>{content.venue}</span>

    if (content.distance) distance = <span className='distance'>{ content.distance.toFixed(1) + ' mi' }</span>

    if (content.opens && content.closes) hoursToday = content.opens.format('ha') + ' - ' + content.closes.format('ha')
    if (content.open_now) openTil = t('Open til') + ' ' + content.closes.format('ha')
   
    openNow = <span className='openNow hoursToday'>{t('Not open')}</span> 
    if (hoursToday) openNow = <span className='openNow hoursToday'>{hoursToday}</span>
    if (openTil) openNow = <span className='openNow'>{openTil}</span>
    if (content.popular_now) openNow = <span className='openNow popularNow'>Vibe'n now</span>

    return (
        <Fragment>
            <Item.Image src={content.images[0]} size='small' />
            <Item.Content style={{ position: 'relative' }}>
                <Button 
                    className='savePlace' 
                    color={content.is_saved ? 'black' : null} 
                    onClick={e => handleClick(e, content)} 
                    icon='like' circular size='mini'
                    style={{ position: 'absolute', right: '1rem', zIndex: '10' }} />


                {recommendation}
                {openNow}
                <Item.Header>{name}</Item.Header>
                <Item.Extra className='moreInfo'>
                    {venue}
                    {categories !== null && categories.length > 0 &&
                        <Item.Extra>
                            {categories}
                            {distance}
                        </Item.Extra>}
                    {vibes}
                    
                </Item.Extra>
            </Item.Content>
        </Fragment>    
    );
}

export default withTranslation()(cardPLaceLayout)