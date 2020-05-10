import React, { Fragment } from 'react'
import { Item, Icon, Label } from 'semantic-ui-react'

import helpers from '../../helpers';

function cardPLaceLayout(props) {

    let content = props.properties

    let name = content.name;    
    let score = Math.round(content.average_score)

    let categories = null
    let venue = null
    let vibes = null;

    // TODO: Move to server side
    if (name) {
        name = name.split(' | ')
        name = name[0]
    }

    if (typeof (content.categories) == 'object' && content.categories.length > 0) {        
        categories = content.categories.map((category) => <span key={category} className={category}>Category</span>)
    } else {
        categories = helpers.toTitleCase(content.categories) 
    }

    if (content.venue) venue = <span className='venue'>{content.venue}</span>

    if (typeof content.vibes !== "undefined") {
        let remainder = content.vibes.length - 1
        vibes = null

        let first_vibe = helpers.toTitleCase(content.vibes[0])

        // Handle vibe label layout
        if (remainder > 0) vibes = <Fragment>
                <Label circular key={content.vibes[0]} className={'vibe label ' + content.vibes[0]}>{first_vibe}</Label>
                <Label circular title={'See all ' + remainder + 'vibes.'}>+ {remainder}</Label>
            </Fragment>
        if (remainder === 0) vibes = <Label key={content.vibes[0]} className={'vibe label ' + content.vibes[0]}>{first_vibe}</Label>

        // vibes = content.vibes.map((vibe) => <Label key={vibe} className={'vibe label ' + vibe}>{vibe}</Label>);
    }

    // TODO: Make this a component and internationalize it.    
    let top_icon = <Icon name='heartbeat' />
    let recommendation = <span className='interested'>{score} Good Vibes</span>

    switch (props.index) {
        case 0:
            recommendation = <span className='interested top_match'>{top_icon} {score} Totally Your Vibe</span>
            break;
    
        default:
            break;
    }

    return (
        <Fragment>
            <Item.Image src={content.images[0]} size='small' />
            <Item.Content>
                {categories !== null && categories.length > 0 &&
                    <Item.Extra className='date'>{categories}</Item.Extra>
                }
                            
                <Item.Header>{name}</Item.Header>
                <Item.Extra>
                    <div>
                        {vibes}
                    </div>
                    {venue}
                    {recommendation}
                </Item.Extra>
            </Item.Content>
        </Fragment>    
    );
}

export default cardPLaceLayout